<template>
  <!-- ── Floating action button ── -->
  <button class="chat-fab" @click="isOpen = !isOpen" :class="{ 'is-open': isOpen }">
    <span class="fab-ring" v-if="totalUnread > 0 && !isOpen"></span>
    <Transition name="fab-icon" mode="out-in">
      <X v-if="isOpen" :size="20" key="x"/>
      <MessageSquare v-else :size="20" key="msg"/>
    </Transition>
    <span class="fab-badge" v-if="totalUnread > 0">{{ totalUnread }}</span>
  </button>

  <!-- ── Chat panel ── -->
  <Transition name="chat-panel">
    <div v-if="isOpen" class="chat-panel">

      <!-- Accent stripe -->
      <div class="cp-accent"></div>

      <!-- Header -->
      <div class="cp-hd">
        <div class="cp-hd-left">
          <div class="cp-hd-icon"><MessageSquare :size="14"/></div>
          <div class="cp-hd-text">
            <span class="cp-hd-title">Tin nhắn nội bộ</span>
            <span class="cp-hd-sub">
              <span class="online-dot"></span>
              {{ onlineCount }} đại lý đang online
            </span>
          </div>
          <span class="cp-hd-badge" v-if="totalUnread > 0">{{ totalUnread }} mới</span>
        </div>
        <button class="cp-close-btn" @click="isOpen = false" title="Đóng">
          <X :size="13"/>
        </button>
      </div>

      <!-- Body -->
      <div class="cp-body">

        <!-- ── Thread list ── -->
        <div class="cp-list">
          <div class="cp-search">
            <Search :size="12" class="cp-search-ic"/>
            <input v-model="searchQ" placeholder="Tìm đại lý…"/>
          </div>

          <div class="cp-section-lbl">CUỘC TRÒ CHUYỆN</div>

          <div class="cp-threads">
            <div
              v-for="t in filteredThreads"
              :key="t.agentId"
              class="cpt"
              :class="{ active: activeThread === t.agentId }"
              @click="openThread(t)"
            >
              <div class="cpt-av-wrap">
                <div class="cpt-av" :style="{ background: agentGrad(t.agentId) }">
                  {{ shortInit(t.agentName) }}
                </div>
                <span class="cpt-dot" :class="{ online: t.online }"></span>
              </div>

              <div class="cpt-body">
                <div class="cpt-row1">
                  <span class="cpt-name" :class="{ bold: t.unread > 0 }">{{ shortName(t.agentName) }}</span>
                  <span class="cpt-time">{{ t.lastTime }}</span>
                </div>
                <div class="cpt-row2">
                  <span class="cpt-badge" :class="'type' + t.agentType">L{{ t.agentType }}</span>
                  <span class="cpt-preview" :class="{ fw: t.unread > 0 }">{{ t.lastMsg }}</span>
                </div>
              </div>

              <span class="cpt-unread" v-if="t.unread > 0">{{ t.unread }}</span>
            </div>
          </div>
        </div>

        <!-- ── Conversation ── -->
        <div class="cp-convo" v-if="activeThreadData">

          <!-- Convo header -->
          <div class="cp-convo-hd">
            <div class="cpt-av-wrap">
              <div class="cpt-av" :style="{ background: agentGrad(activeThreadData.agentId) }">
                {{ shortInit(activeThreadData.agentName) }}
              </div>
              <span class="cpt-dot lg" :class="{ online: activeThreadData.online }"></span>
            </div>
            <div class="ch-meta">
              <strong class="ch-name">{{ shortName(activeThreadData.agentName) }}</strong>
              <div class="ch-sub">
                <span class="ch-status" :class="{ online: activeThreadData.online }">
                  {{ activeThreadData.online ? '● Đang online' : '○ Offline' }}
                </span>
                <span class="ch-sep">·</span>
                <span class="ch-detail">{{ activeThreadData.quan }}</span>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div class="cp-msgs" ref="msgsEl">
            <div class="msg-date-sep"><span>Hôm nay</span></div>

            <template v-for="(msg, idx) in activeMessages" :key="msg.id">
              <div
                class="msg-row"
                :class="msg.sender === 'admin' ? 'out' : 'in'"
              >
                <!-- Agent avatar — only on last bubble in a group -->
                <div class="msg-av-col" v-if="msg.sender === 'agent'">
                  <div
                    class="msg-mini-av"
                    v-if="isLastInGroup(idx)"
                    :style="{ background: agentGrad(activeThreadData.agentId) }"
                  >{{ shortInit(activeThreadData.agentName) }}</div>
                  <div class="msg-av-spacer" v-else></div>
                </div>

                <div class="msg-col">
                  <div class="msg-bubble">{{ msg.text }}</div>
                  <div class="msg-foot" v-if="isLastInGroup(idx)">
                    <span class="msg-time">{{ msg.time }}</span>
                    <span class="msg-tick" v-if="msg.sender === 'admin'">✓✓</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Typing indicator -->
            <div class="typing-row" v-if="isTyping">
              <div
                class="msg-mini-av"
                :style="{ background: agentGrad(activeThreadData.agentId) }"
              >{{ shortInit(activeThreadData.agentName) }}</div>
              <div class="typing-bubble">
                <span class="dot d1"></span>
                <span class="dot d2"></span>
                <span class="dot d3"></span>
              </div>
            </div>
          </div>

          <!-- Quick replies -->
          <Transition name="qr-fade">
            <div class="quick-replies" v-if="showQR && !inputText">
              <button
                v-for="qr in quickReplies"
                :key="qr"
                class="qr-chip"
                @click="useQR(qr)"
              >{{ qr }}</button>
            </div>
          </Transition>

          <!-- Input area -->
          <div class="cp-input-row">
            <button class="inp-side" title="Đính kèm file"><Paperclip :size="14"/></button>
            <input
              v-model="inputText"
              ref="inputEl"
              class="cp-input"
              placeholder="Nhập tin nhắn…"
              @keydown.enter.prevent="sendMsg"
              @input="showQR = false"
            />
            <button
              class="cp-send"
              :class="{ active: inputText.trim() }"
              @click="sendMsg"
              :disabled="!inputText.trim()"
            ><Send :size="14"/></button>
          </div>

        </div>

        <!-- ── Empty state ── -->
        <div class="cp-empty" v-else>
          <div class="cp-empty-bubbles">
            <div class="eb eb1">Xin chào! 👋</div>
            <div class="eb eb2">Hàng về rồi ạ</div>
            <div class="eb eb3">Cảm ơn bạn nhé!</div>
          </div>
          <p class="ce-title">Hộp thư đại lý</p>
          <p class="ce-sub">Chọn cuộc trò chuyện bên trái để xem và gửi tin nhắn</p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { MessageSquare, X, Search, Send, Paperclip } from 'lucide-vue-next';

/* ── Avatar palette ── */
const GRADS = [
  'linear-gradient(135deg,#059669,#10b981)',
  'linear-gradient(135deg,#2563eb,#60a5fa)',
  'linear-gradient(135deg,#7c3aed,#a78bfa)',
  'linear-gradient(135deg,#d97706,#fbbf24)',
];
const agentGrad  = (id) => GRADS[id % 4];
const shortName  = (name) => name.replace(/^Đại lý\s*/i, '');
const shortInit  = (name) => shortName(name).charAt(0).toUpperCase();

/* ── State ── */
const isOpen      = ref(false);
const searchQ     = ref('');
const activeThread = ref(null);
const inputText   = ref('');
const msgsEl      = ref(null);
const inputEl     = ref(null);
const isTyping    = ref(false);
const showQR      = ref(true);

const quickReplies = ['Cảm ơn anh/chị! 😊', 'Đã ghi nhận ✓', 'Mình kiểm tra lại nhé', 'Liên hệ ngay sớm nhất'];

const agentReplies = [
  'Dạ, để tôi kiểm tra lại ạ.',
  'Ok, cảm ơn bạn nhé! 👍',
  'Vâng ạ, mình sẽ xử lý sớm.',
  'Dạ được, tôi liên hệ lại sau.',
  'Cảm ơn thông tin! Rõ ràng rồi ạ.',
];

/* ── Mock threads ── */
const threads = ref([
  {
    agentId: 1, agentName: 'Đại lý Tuấn Phát', agentType: 1, quan: 'Quận 1',
    online: true, lastMsg: 'Vâng, tôi sẽ thanh toán sớm ạ', lastTime: '14:32', unread: 2,
    messages: [
      { id: 1, sender: 'admin', text: 'Chào anh Tuấn! Công nợ tháng này là 8.5 triệu, anh sắp xếp thanh toán sớm nhé 😊', time: '14:20' },
      { id: 2, sender: 'agent', text: 'Dạ chị ơi, cuối tuần tôi ghé thanh toán. Tiện thể hỏi thêm về lô hàng mới.', time: '14:25' },
      { id: 3, sender: 'admin', text: 'Lô hàng mới dự kiến về ngày 20 tháng này ạ. Anh đặt trước để được ưu tiên nhé!', time: '14:28' },
      { id: 4, sender: 'agent', text: 'Vâng, tôi sẽ thanh toán sớm ạ', time: '14:32' },
    ],
  },
  {
    agentId: 2, agentName: 'Đại lý Lan Anh', agentType: 2, quan: 'Quận 3',
    online: true, lastMsg: 'Cho tôi đặt thêm 50 thùng hàng A', lastTime: '11:15', unread: 1,
    messages: [
      { id: 1, sender: 'agent', text: 'Chào admin! Kho còn hàng không ạ, tôi muốn đặt thêm.', time: '11:10' },
      { id: 2, sender: 'admin', text: 'Chào chị Lan Anh! Kho vẫn còn, chị cần mặt hàng gì ạ?', time: '11:12' },
      { id: 3, sender: 'agent', text: 'Cho tôi đặt thêm 50 thùng hàng A', time: '11:15' },
    ],
  },
  {
    agentId: 5, agentName: 'Đại lý Hoa Phượng', agentType: 1, quan: 'Bình Thạnh',
    online: false, lastMsg: 'Ok, cảm ơn bạn nhiều!', lastTime: 'Hôm qua', unread: 0,
    messages: [
      { id: 1, sender: 'admin', text: 'Chào chị Phượng! Công nợ tháng này vượt hạn mức rồi, chị cần xử lý gấp ạ 🙏', time: '09:00' },
      { id: 2, sender: 'agent', text: 'Ôi, xin lỗi ạ. Để chị kiểm tra rồi báo lại sau.', time: '09:15' },
      { id: 3, sender: 'admin', text: 'Chị có thể ghé văn phòng chiều nay không? Bên mình hỗ trợ giấy tờ cho.', time: '09:20' },
      { id: 4, sender: 'agent', text: 'Ok, cảm ơn bạn nhiều!', time: '09:30' },
    ],
  },
  {
    agentId: 7, agentName: 'Đại lý Phú Quý', agentType: 1, quan: 'Quận 1',
    online: false, lastMsg: 'Chiều nay em gửi bảng giá nhé anh', lastTime: 'T2', unread: 0,
    messages: [
      { id: 1, sender: 'agent', text: 'Chào em! Anh hỏi thăm bảng giá mặt hàng B, có cập nhật gì chưa?', time: '08:00' },
      { id: 2, sender: 'admin', text: 'Dạ chào anh! Bảng giá mới đang cập nhật ạ, chiều nay em gửi qua email nhé.', time: '08:05' },
      { id: 3, sender: 'agent', text: 'Chiều nay em gửi bảng giá nhé anh', time: '08:07' },
    ],
  },
]);

/* ── Computed ── */
const onlineCount      = computed(() => threads.value.filter(t => t.online).length);
const totalUnread      = computed(() => threads.value.reduce((s, t) => s + t.unread, 0));
const filteredThreads  = computed(() => {
  const q = searchQ.value.toLowerCase();
  return threads.value.filter(t => !q || t.agentName.toLowerCase().includes(q));
});
const activeThreadData = computed(() => threads.value.find(t => t.agentId === activeThread.value) ?? null);
const activeMessages   = computed(() => activeThreadData.value?.messages ?? []);

const isLastInGroup = (idx) => {
  const msgs = activeMessages.value;
  return idx === msgs.length - 1 || msgs[idx].sender !== msgs[idx + 1]?.sender;
};

/* ── Actions ── */
const scrollToBottom = () => nextTick(() => { if (msgsEl.value) msgsEl.value.scrollTop = msgsEl.value.scrollHeight; });

const openThread = (t) => {
  activeThread.value = t.agentId;
  t.unread = 0;
  showQR.value = true;
  scrollToBottom();
};

const sendMsg = () => {
  const text = inputText.value.trim();
  if (!text) return;
  const t = threads.value.find(x => x.agentId === activeThread.value);
  if (!t) return;
  const now  = new Date();
  const hhmm = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
  t.messages.push({ id: Date.now(), sender: 'admin', text, time: hhmm });
  t.lastMsg  = text;
  t.lastTime = hhmm;
  inputText.value = '';
  showQR.value = false;
  scrollToBottom();

  /* Mock auto-reply when agent is online */
  if (t.online) {
    setTimeout(() => {
      isTyping.value = true;
      scrollToBottom();
      setTimeout(() => {
        isTyping.value = false;
        const reply = agentReplies[Math.floor(Math.random() * agentReplies.length)];
        const n2 = new Date();
        const hh2 = `${n2.getHours().toString().padStart(2,'0')}:${n2.getMinutes().toString().padStart(2,'0')}`;
        t.messages.push({ id: Date.now() + 1, sender: 'agent', text: reply, time: hh2 });
        t.lastMsg  = reply;
        t.lastTime = hh2;
        scrollToBottom();
      }, 1200 + Math.random() * 700);
    }, 700);
  }
};

const useQR = (text) => { inputText.value = text; inputEl.value?.focus(); };

watch(isOpen, (val) => { if (val && activeThread.value !== null) scrollToBottom(); });
</script>

<style scoped>
/* ══ FAB ══ */
.chat-fab {
  position: fixed; bottom: 28px; right: 28px; z-index: 9990;
  width: 52px; height: 52px; border-radius: 50%; border: none;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(5,150,105,.4), 0 2px 8px rgba(5,150,105,.2);
  transition: transform .2s ease, box-shadow .2s ease, background .2s;
}
.chat-fab:hover  { transform: scale(1.1); box-shadow: 0 6px 28px rgba(5,150,105,.55); }
.chat-fab.is-open { background: linear-gradient(135deg, #475569, #64748b); box-shadow: 0 4px 16px rgba(0,0,0,.15); }

.fab-ring {
  position: absolute; inset: -5px; border-radius: 50%;
  border: 2px solid rgba(5,150,105,.45);
  animation: fabPulse 2.2s ease-out infinite;
  pointer-events: none;
}
@keyframes fabPulse {
  0%   { transform: scale(1);   opacity: 1; }
  100% { transform: scale(1.55); opacity: 0; }
}

.fab-badge {
  position: absolute; top: -3px; right: -3px;
  min-width: 18px; height: 18px; padding: 0 4px;
  background: #ef4444; color: white; border: 2px solid white;
  border-radius: 99px; font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; pointer-events: none;
}

/* ══ PANEL ══ */
.chat-panel {
  position: fixed; bottom: 90px; right: 28px; z-index: 9989;
  width: 700px; height: 510px;
  background: #fff; border-radius: 18px;
  box-shadow: 0 24px 64px rgba(15,23,42,.16), 0 4px 16px rgba(15,23,42,.06);
  border: 1px solid rgba(15,23,42,.05);
  display: flex; flex-direction: column; overflow: hidden;
  font-family: 'Inter','Outfit',ui-sans-serif,system-ui,sans-serif;
  font-size: 13px;
}

.cp-accent {
  height: 3px; flex-shrink: 0;
  background: linear-gradient(90deg, #059669, #10b981 50%, #3b82f6);
}

/* ── Header ── */
.cp-hd {
  padding: 12px 16px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(120deg, #fff 0%, #f0fdf8 100%);
  border-bottom: 1px solid rgba(15,23,42,.06);
}
.cp-hd-left  { display: flex; align-items: center; gap: 10px; }
.cp-hd-icon  { width: 28px; height: 28px; border-radius: 8px; background: #ecfdf5; color: #059669; display: flex; align-items: center; justify-content: center; }
.cp-hd-title { display: block; font-size: 13px; font-weight: 700; color: #0f172a; }
.cp-hd-sub   { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #64748b; margin-top: 1px; }
.online-dot  { width: 6px; height: 6px; border-radius: 50%; background: #10b981; flex-shrink: 0; }
.cp-hd-badge { background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px; }
.cp-close-btn { width: 26px; height: 26px; border: none; background: rgba(15,23,42,.06); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: .15s; }
.cp-close-btn:hover { background: rgba(239,68,68,.12); color: #ef4444; }

/* ── Body ── */
.cp-body { flex: 1; display: flex; overflow: hidden; }

/* ── Thread list ── */
.cp-list { width: 220px; flex-shrink: 0; border-right: 1px solid rgba(15,23,42,.05); display: flex; flex-direction: column; background: #fafafa; }
.cp-search {
  padding: 10px 12px; border-bottom: 1px solid rgba(15,23,42,.05);
  display: flex; align-items: center; gap: 7px; flex-shrink: 0;
}
.cp-search-ic { color: #94a3b8; }
.cp-search input { border: none; background: transparent; outline: none; font-size: 12px; flex: 1; color: #0f172a; font-family: inherit; }

.cp-section-lbl { font-size: 9.5px; font-weight: 800; letter-spacing: 1px; color: #cbd5e1; padding: 10px 14px 4px; flex-shrink: 0; }

.cp-threads { flex: 1; overflow-y: auto; }
.cp-threads::-webkit-scrollbar { width: 3px; }
.cp-threads::-webkit-scrollbar-thumb { background: rgba(0,0,0,.1); border-radius: 99px; }

.cpt {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; cursor: pointer;
  transition: background .15s; position: relative;
  border-bottom: 1px solid rgba(15,23,42,.04);
}
.cpt:hover { background: rgba(15,23,42,.04); }
.cpt.active { background: rgba(5,150,105,.09); border-left: 3px solid #059669; padding-left: 9px; }

.cpt-av-wrap { position: relative; flex-shrink: 0; }
.cpt-av {
  width: 36px; height: 36px; border-radius: 50%;
  color: white; font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.cpt-dot {
  position: absolute; bottom: 0; right: 0;
  width: 9px; height: 9px; border-radius: 50%;
  background: #cbd5e1; border: 2px solid #fafafa;
}
.cpt-dot.online { background: #10b981; }
.cpt-dot.lg { width: 11px; height: 11px; border-width: 2.5px; border-color: #f8fafc; }

.cpt-body { flex: 1; min-width: 0; }
.cpt-row1 { display: flex; justify-content: space-between; align-items: baseline; }
.cpt-name  { font-size: 12px; font-weight: 500; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px; }
.cpt-name.bold { font-weight: 700; color: #0f172a; }
.cpt-time  { font-size: 10px; color: #94a3b8; white-space: nowrap; flex-shrink: 0; }
.cpt-row2  { display: flex; align-items: center; gap: 5px; margin-top: 3px; }
.cpt-badge { font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; flex-shrink: 0; }
.cpt-badge.type1 { background: #ecfdf5; color: #065f46; }
.cpt-badge.type2 { background: #eff6ff; color: #1e40af; }
.cpt-preview { font-size: 11px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; }
.cpt-preview.fw { color: #475569; font-weight: 600; }
.cpt-unread { background: #059669; color: #fff; font-size: 10px; font-weight: 700; min-width: 18px; height: 18px; border-radius: 99px; display: flex; align-items: center; justify-content: center; padding: 0 4px; flex-shrink: 0; }

/* ── Conversation ── */
.cp-convo { flex: 1; display: flex; flex-direction: column; min-width: 0; }

.cp-convo-hd {
  padding: 10px 14px; border-bottom: 1px solid rgba(15,23,42,.06);
  display: flex; align-items: center; gap: 10px;
  background: #fff; flex-shrink: 0;
}
.ch-meta  { flex: 1; min-width: 0; }
.ch-name  { display: block; font-size: 13px; font-weight: 700; color: #0f172a; }
.ch-sub   { display: flex; align-items: center; gap: 5px; font-size: 11px; margin-top: 2px; }
.ch-status { color: #94a3b8; }
.ch-status.online { color: #10b981; }
.ch-sep   { color: #e2e8f0; }
.ch-detail { color: #94a3b8; }

/* Messages */
.cp-msgs {
  flex: 1; overflow-y: auto; padding: 16px 12px;
  display: flex; flex-direction: column; gap: 2px;
  background: #f8fafc;
}
.cp-msgs::-webkit-scrollbar { width: 3px; }
.cp-msgs::-webkit-scrollbar-thumb { background: rgba(0,0,0,.08); border-radius: 99px; }

.msg-date-sep {
  text-align: center; margin: 4px 0 12px;
}
.msg-date-sep span {
  font-size: 10px; font-weight: 700; color: #94a3b8;
  background: #e2e8f0; padding: 3px 10px; border-radius: 99px;
}

.msg-row { display: flex; align-items: flex-end; gap: 6px; margin-bottom: 1px; }
.msg-row.out { flex-direction: row-reverse; }
.msg-row.in  { flex-direction: row; }

.msg-av-col { width: 24px; flex-shrink: 0; }
.msg-mini-av {
  width: 24px; height: 24px; border-radius: 50%;
  color: white; font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.msg-av-spacer { width: 24px; }

.msg-col { display: flex; flex-direction: column; gap: 2px; max-width: 72%; }
.msg-row.out .msg-col { align-items: flex-end; }
.msg-row.in  .msg-col { align-items: flex-start; }

.msg-bubble {
  padding: 9px 13px; border-radius: 16px;
  font-size: 13px; line-height: 1.45; word-break: break-word;
  max-width: 100%;
}
.msg-row.out .msg-bubble {
  background: linear-gradient(135deg, #059669, #10b981);
  color: white; border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(5,150,105,.25);
}
.msg-row.in .msg-bubble {
  background: white; color: #0f172a;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 4px rgba(15,23,42,.07);
  border: 1px solid rgba(15,23,42,.06);
}

.msg-foot { display: flex; align-items: center; gap: 4px; }
.msg-time  { font-size: 10px; color: #94a3b8; }
.msg-tick  { font-size: 10px; color: #10b981; }

/* Typing indicator */
.typing-row { display: flex; align-items: flex-end; gap: 6px; margin-top: 6px; }
.typing-bubble {
  background: white; border: 1px solid rgba(15,23,42,.06);
  border-radius: 16px; border-bottom-left-radius: 4px;
  padding: 10px 14px; display: flex; gap: 4px; align-items: center;
  box-shadow: 0 1px 4px rgba(15,23,42,.07);
}
.dot {
  width: 6px; height: 6px; border-radius: 50%; background: #94a3b8;
  animation: dotBounce 1.3s ease-in-out infinite;
}
.d1 { animation-delay: 0s; }
.d2 { animation-delay: .18s; }
.d3 { animation-delay: .36s; }
@keyframes dotBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: .4; }
  30%           { transform: translateY(-5px); opacity: 1; }
}

/* Quick replies */
.quick-replies {
  padding: 8px 12px; display: flex; gap: 6px; flex-wrap: wrap;
  border-top: 1px solid rgba(15,23,42,.05); background: #fff; flex-shrink: 0;
}
.qr-chip {
  font-size: 11.5px; font-weight: 500; color: #059669;
  background: #ecfdf5; border: 1px solid rgba(5,150,105,.2);
  border-radius: 99px; padding: 4px 11px; cursor: pointer;
  transition: background .15s, transform .1s; font-family: inherit;
  white-space: nowrap;
}
.qr-chip:hover { background: rgba(5,150,105,.15); transform: translateY(-1px); }

/* Input area */
.cp-input-row {
  padding: 10px 12px; border-top: 1px solid rgba(15,23,42,.05);
  display: flex; gap: 8px; align-items: center; flex-shrink: 0;
  background: #fff;
}
.inp-side {
  width: 30px; height: 30px; border: none; background: rgba(15,23,42,.05);
  border-radius: 50%; color: #94a3b8; display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: .15s;
}
.inp-side:hover { background: rgba(15,23,42,.1); color: #475569; }
.cp-input {
  flex: 1; border: 1.5px solid rgba(15,23,42,.1); border-radius: 22px;
  padding: 8px 16px; font-size: 13px; outline: none; background: #f8fafc;
  transition: border-color .15s, background .15s; font-family: inherit;
}
.cp-input:focus { border-color: #059669; background: #fff; box-shadow: 0 0 0 3px rgba(5,150,105,.07); }
.cp-send {
  width: 34px; height: 34px; border-radius: 50%; border: none;
  background: #e2e8f0; color: #94a3b8;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: background .15s, color .15s, transform .1s;
}
.cp-send.active { background: #059669; color: white; box-shadow: 0 2px 8px rgba(5,150,105,.35); }
.cp-send.active:hover { background: #047857; transform: scale(1.07); }
.cp-send:disabled { cursor: not-allowed; }

/* ── Empty state ── */
.cp-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  padding: 24px; background: #f8fafc;
}
.cp-empty-bubbles { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.eb {
  padding: 8px 16px; border-radius: 14px; font-size: 12.5px; font-weight: 500;
  box-shadow: 0 2px 8px rgba(15,23,42,.07);
}
.eb1 { background: linear-gradient(135deg,#059669,#10b981); color: white; align-self: flex-end; animation: floatBubble 3.5s ease-in-out infinite; border-bottom-right-radius: 4px; }
.eb2 { background: white; color: #0f172a; border: 1px solid rgba(15,23,42,.08); align-self: flex-start; animation: floatBubble 3.5s ease-in-out infinite .8s; border-bottom-left-radius: 4px; }
.eb3 { background: white; color: #0f172a; border: 1px solid rgba(15,23,42,.08); align-self: flex-end; animation: floatBubble 3.5s ease-in-out infinite 1.6s; border-bottom-right-radius: 4px; }
@keyframes floatBubble {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}
.ce-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0; }
.ce-sub   { font-size: 12px; color: #94a3b8; text-align: center; margin: 0; line-height: 1.6; }

/* ── Transitions ── */
.chat-panel-enter-active { animation: chatUp .25s cubic-bezier(.4,0,.2,1); }
.chat-panel-leave-active { animation: chatDown .18s cubic-bezier(.4,0,.2,1); }
@keyframes chatUp   { from { opacity:0; transform: translateY(18px) scale(.96); } to { opacity:1; transform: translateY(0) scale(1); } }
@keyframes chatDown { from { opacity:1; transform: translateY(0)  scale(1); }    to { opacity:0; transform: translateY(18px) scale(.96); } }

.fab-icon-enter-active, .fab-icon-leave-active { transition: opacity .1s, transform .1s; }
.fab-icon-enter-from { opacity:0; transform: rotate(-90deg) scale(.6); }
.fab-icon-leave-to   { opacity:0; transform: rotate( 90deg) scale(.6); }

.qr-fade-enter-active { animation: qrIn .18s ease; }
.qr-fade-leave-active { animation: qrIn .14s ease reverse; }
@keyframes qrIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: translateY(0); } }
</style>
