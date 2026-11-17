// The 18 frames from Figma page "Communication Mode (Our Design)".
// Each screen = a base page + overlay. `links` are the prototype hotspots.
import {
  C, T, Icon, Photo, Abs, Btn, Dim, Sheet, Banner, GuideBar, GuideCard, Glow, Pointer, useHot, useL, stroke,
} from '../components/ui.jsx';
import {
  HomeBase, ContactBase, ChatBase, ContactTile, ContactActions, InputArea, PHOTOS, QUICK_REPLIES,
} from './bases.jsx';
import { NavBar, Screen, StatusBar } from '../components/ui.jsx';
import { WECHAT_SCREENS } from './wechat.jsx';

/* ---------- link maps shared by several frames ---------- */
const HOME = { daughter: '02', messages: '03', voice: '04', video: '05', help: '10', settings: '18' };
const CONTACT = { back: '01', home: '01', message: '03', voice: '04', video: '05', help: '10', showMe: '09' };
const CHAT = { back: '02', home: '01' };
const QUICK = { back: '02', home: '01', edit: '18', replies: ['16'] };

const CHAT_FULL = ['date', 'dinner', 'soup', 'voiceIn'];

/* ---------- 01–09: core screens ---------- */
function S01() {
  return <HomeBase links={HOME} />;
}

function S02() {
  return <ContactBase links={CONTACT} />;
}

function S03() {
  return <ChatBase messages={CHAT_FULL} links={{ ...CHAT, send: '07' }} />;
}

export const clock = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

/** Voice recorder sheet (04). The Full MVP passes the contact, a live time and handlers. */
export function RecorderSheet({ name = ['Daughter', '女儿'], time = '0:12', cancel = '02', send = '06' }) {
  const bars = [10, 18, 30, 44, 26, 52, 36, 20, 40, 56, 30, 16, 34, 48, 24, 12, 28, 40, 18, 10];
  const l = useL();
  return (
    <>
      <Dim op={0.45} />
      <Sheet y={421} pad="22px 24px 34px 24px" gap={16} align="center">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 27 }}>
          <div className="cm-rec-dot" style={{ width: 14, height: 14, borderRadius: 7, background: '#e5484d' }} />
          <T w={700} s={22} lh={27} nowrap>{l(`Recording to ${name[0]}…`, `正在录音（发给${name[1]}）`)}</T>
        </div>
        <T w={700} s={60} lh={73} nowrap>{time}</T>
        <div className="cm-wave" style={{ height: 56, display: 'flex', alignItems: 'center', gap: 5 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ width: 6, height: h, borderRadius: 3, background: C.green, animationDelay: `${(i % 7) * 0.11}s` }} />
          ))}
        </div>
        <T s={18} lh={22} c={C.sub} align="center" nowrap>
          {l('Speak now. Tap “Send” when you finish.', '请说话，说完请按“发送”。')}
        </T>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn kind="neutral" icon="x" label="Cancel" cn="取消" w={167} to={cancel} />
          <Btn g="rec-send" kind="primary" icon="send" label="Send" cn="发送" w={167} to={send} />
        </div>
      </Sheet>
    </>
  );
}

function S04() {
  return (
    <ContactBase>
      <RecorderSheet />
    </ContactBase>
  );
}

/** Call confirmation card (05). */
export function CallConfirm({ contact = { name: 'Daughter', cn: '女儿', photo: PHOTOS.daughter }, call, cancel = '02' }) {
  const l = useL();
  const c = contact;
  return (
    <>
      <Dim op={0.5} />
      <Abs
        x={20}
        y={241}
        w={353}
        style={{
          background: C.white,
          borderRadius: 24,
          padding: '28px 24px 24px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <Photo src={c.photo} size={104} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <T w={700} s={26} lh={31} align="center">{l(`Video call ${c.name}?`, `给${c.cn}打视频电话？`)}</T>
        </div>
        <Btn g="call-yes" kind="primary" icon="video" label="Call" cn="拨打" w={305} to={call} />
        <Btn kind="neutral" icon="x" label="Cancel" cn="取消" w={305} to={cancel} />
      </Abs>
    </>
  );
}

function S05() {
  return (
    <ContactBase>
      <CallConfirm />
    </ContactBase>
  );
}

function S06() {
  const l = useL();
  return (
    <ChatBase messages={[...CHAT_FULL, 'voiceOut']} links={{ ...CHAT, send: '07' }}>
      <Banner title={l('Sent to Daughter', '已发送给女儿')} />
    </ChatBase>
  );
}

/** “Message not sent” panel under the nav bar (07). */
export function ErrorPanel({ retry = '22', title, message }) {
  const l = useL();
  return (
    <Abs
        x={0}
        y={115}
        w={393}
        h={231}
        style={{
          background: C.bg,
          padding: '12px 16px 14px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
        }}
      >
        <Banner
          type="error"
          h={119}
          title={title || l('Message not sent', '消息没有发出')}
          message={message || l('No internet. Check Wi-Fi, then tap Try again.', '没有网络，请检查 Wi-Fi 后重试。')}
        />
        <Btn g="retry" kind="primary" icon="retry" label="Try again" cn="重试" w={361} to={retry} />
      </Abs>
  );
}

function S07() {
  return (
    <ChatBase messages={[...CHAT_FULL, 'voiceOut', 'sundayFailed']} links={CHAT}>
      <ErrorPanel />
    </ChatBase>
  );
}

/** Mini "screenshot" of a screen (Home by default), as in the help request preview. */
function MiniHome({ shot }) {
  return (
    <div
      style={{
        width: 79,
        height: 170,
        borderRadius: 8,
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: stroke(0.2, C.border),
        position: 'relative',
      }}
    >
      <div style={{ transform: 'scale(0.2)', transformOrigin: '0 0', pointerEvents: 'none' }}>
        {shot || <HomeBase />}
      </div>
    </div>
  );
}

/** “Ask Son for help?” sheet (08). `shot` is the screen to show in the screenshot. */
export function AskSheet({ shot, send = '01', cancel = '10' }) {
  const l = useL();
  return (
    <>
      <Dim op={0.45} />
      <Sheet y={347} pad="22px 24px 34px 24px" gap={16}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <T w={700} s={26} lh={31} nowrap>{l('Ask Son for help?', '请儿子帮忙？')}</T>
        </div>
        <div
          style={{
            height: 194,
            boxSizing: 'border-box',
            padding: 12,
            display: 'flex',
            gap: 14,
            background: C.field,
            borderRadius: 16,
          }}
        >
          <MiniHome shot={shot} />
          <div style={{ width: 228, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Photo src={PHOTOS.son} size={32} />
              <T w={500} s={17} lh={20} nowrap>{l('To: Son', '发给：儿子')}</T>
            </div>
            <T s={17} lh={22}>
              {l('“Hi, I need help with WeChat. Here is my screen.”', '“我需要帮忙使用微信，这是我的屏幕。”')}
            </T>
          </div>
        </div>
        <Btn kind="primary" icon="send" label="Send request" cn="发送求助" w={345} to={send} />
        <Btn kind="neutral" icon="x" label="Cancel" cn="取消" w={345} to={cancel} />
      </Sheet>
    </>
  );
}

function S08() {
  return (
    <HomeBase>
      <AskSheet />
    </HomeBase>
  );
}

function S09() {
  const l = useL();
  return (
    <ContactBase>
      <Dim op={0.6} />
      <Abs x={24} y={563}>
        <ContactActions only="video" links={{ video: '05' }} />
      </Abs>
      <Glow x={18} y={557} w={357} h={88} r={22} width={4} glow={false} />
      <Abs
        x={20}
        y={295}
        w={353}
        style={{
          background: C.white,
          borderRadius: 20,
          padding: '18px 20px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
          <Icon name="bulb" size={24} color={C.greenIcon} />
          <T w={500} s={16} lh={19} c={C.greenDark} nowrap>{l('Step 1 of 2', '第1步，共2步')}</T>
        </div>
        <T w={700} s={21} lh={25}>{l('Tap “Video Call” to see Daughter on your screen.', '点“视频通话”，就能在屏幕上看见女儿。')}</T>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn kind="neutral" icon="x" label="Close" cn="关闭" w={152} h={64} to="02" />
          <Btn kind="primary" icon="check" label="Next" cn="下一步" w={152} h={64} to="05" />
        </div>
      </Abs>
    </ContactBase>
  );
}

/** 22: the failed text went through after “Try again”. */
function S22() {
  const l = useL();
  return (
    <ChatBase messages={[...CHAT_FULL, 'voiceOut', 'sunday']} links={CHAT}>
      <Banner title={l('Sent to Daughter', '已发送给女儿')} />
    </ChatBase>
  );
}

/* ---------- 10–14: Help menu + guided walkthrough ---------- */
export const TOPICS = [
  { id: 'message', icon: 'message', en: 'Send a message', cn: '怎么发消息', to: '11' },
  { id: 'voice', icon: 'mic', en: 'Send a voice message', cn: '怎么发语音' },
  { id: 'video', icon: 'video', en: 'Make a video call', cn: '怎么打视频电话' },
  { id: 'answer', icon: 'phone', en: 'Answer a call', cn: '怎么接电话' },
  { id: 'text', icon: 'text-size', en: 'Make text bigger', cn: '怎么放大字体' },
  { id: 'home', icon: 'home', en: 'Go back to Home', cn: '怎么回到主页', to: '01' },
];

function HelpTopic({ icon, en, cn, selected, to }) {
  const hot = useHot(to);
  const l = useL();
  return (
    <div
      {...hot}
      style={{
        height: selected ? 74 : 71,
        boxSizing: 'border-box',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: C.white,
        borderRadius: 16,
        boxShadow: selected ? stroke(3, C.green) : stroke(1.5, C.neutral),
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          background: C.greenLight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginLeft: selected ? 3 : 2,
        }}
      >
        <Icon name={icon} size={26} color={C.greenIcon} />
      </div>
      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <T w={600} s={20} lh={24} nowrap>{l(en, cn)}</T>
      </div>
      <Icon name="chevron-right" size={26} color="#9a9a9a" style={{ position: 'relative', zIndex: 1 }} />
    </div>
  );
}

/**
 * Help menu sheet (10). The Full MVP passes `topic(id)` for every topic plus say / ask / close handlers.
 * `selected` is the highlighted topic (the Figma frame shows the first one selected).
 */
export function HelpSheet({ topic, say = null, ask = '08', close = '01', selected = 0 }) {
  const sayWhat = useHot(say);
  const l = useL();
  return (
    <>
      <Dim op={0.45} to={close} />
      <Sheet y={117} pad="22px 24px 30px 24px" gap={12}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <T w={700} s={24} lh={29} nowrap>{l('What do you need help with?', '需要什么帮助？')}</T>
          <T s={16} lh={19} c={C.sub} nowrap>{l('Pick one and we will show you step by step.', '点一项，我们一步一步教你。')}</T>
        </div>
        <div
          {...sayWhat}
          style={{
            height: 52,
            boxSizing: 'border-box',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: C.field,
            borderRadius: 28,
            boxShadow: stroke(1, C.border),
          }}
        >
          <Icon name="mic" size={26} color={C.greenIcon} />
          <T w={500} s={16} lh={19} c="#444444" nowrap>{l('Say what you need', '说出你的问题')}</T>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOPICS.map((t, i) => (
            <HelpTopic key={t.en} {...t} to={topic ? () => topic(t.id) : t.to} selected={i === selected} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn kind="secondary" icon="users" label="Ask family" cn="家人帮忙" w={170} pl={14} gap={10} to={ask} />
          <Btn kind="neutral" icon="x" label="Close" cn="关闭" w={166} pl={14} gap={10} to={close} />
        </div>
      </Sheet>
    </>
  );
}

function S10() {
  return (
    <HomeBase>
      <HelpSheet />
    </HomeBase>
  );
}

function S11() {
  const c = { name: 'Daughter', cn: '女儿', photo: PHOTOS.daughter };
  return (
    <HomeBase>
      <Dim op={0.62} />
      <Abs x={20} y={156}>
        <ContactTile {...c} to="12" />
      </Abs>
      <Glow x={12} y={148} w={186} h={196} r={26} />
      <Pointer x={114} y={310} />
      <GuideBar exit="01" />
      <GuideCard
        y={380}
        step={['Step 1 of 3', '第1步，共3步']}
        title="Tap the photo of the person you want to message."
        cn="点一下你想发消息的人的照片。"
        close="01"
        next="12"
      />
    </HomeBase>
  );
}

function S12() {
  return (
    <ContactBase>
      <Dim op={0.62} />
      <Abs x={24} y={383}>
        <ContactActions only="message" links={{ message: '13' }} />
      </Abs>
      <Glow x={16} y={375} w={361} h={92} r={22} />
      <Pointer x={279} y={433} />
      <GuideBar exit="02" />
      <GuideCard y={503} step={['Step 2 of 3', '第2步，共3步']} title="Tap “Send Message”." cn="点“发消息”。" close="02" next="13" />
    </ContactBase>
  );
}

function S13() {
  return (
    <ChatBase messages={[...CHAT_FULL, 'sunday']}>
      <Dim op={0.62} />
      <Abs x={0} y={674} w={393} h={178}>
        <InputArea links={{ send: '14' }} />
      </Abs>
      <Glow x={-8} y={666} w={409} h={194} r={20} />
      <Pointer x={338} y={800} size={48} />
      <GuideBar exit="03" />
      <GuideCard
        y={325}
        step={['Step 3 of 3', '第3步，共3步']}
        title="Type your message, or tap “Speak to type”. Then tap “Send”."
        cn="输入文字，或点“说话打字”，然后点“发送”。"
        close="03"
        next="14"
      />
    </ChatBase>
  );
}

/** “Well done!” card that ends a guide (14). */
export function DoneCard({ y = 179, text = ['You sent a message by yourself.', '你自己发出了消息。'], done = '03', again = '11' }) {
  const l = useL();
  return (
    <>
      <Dim op={0.5} />
      <Abs
        x={20}
        y={y}
        w={353}
        style={{
          background: C.white,
          borderRadius: 24,
          padding: '28px 24px 24px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            background: C.greenLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="check" size={56} color={C.green} />
        </div>
        <T w={700} s={30} lh={36} nowrap>{l('Well done!', '做得好！')}</T>
        <T w={500} s={20} lh={24} align="center" nowrap>{l(...text)}</T>
        <Btn g="guide-done" kind="primary" icon="check" label="Done" cn="完成" w={305} to={done} />
        <Btn kind="secondary" icon="retry" label="Practise again" cn="再练一次" w={305} to={again} />
        <T s={15} lh={18} c={C.sub} align="center" nowrap>
          {l('You can find this guide again under Help.', '在“帮助”里可以再看这个教学。')}
        </T>
      </Abs>
    </>
  );
}

function S14() {
  return (
    <ChatBase messages={[...CHAT_FULL, 'sunday']}>
      <DoneCard />
    </ChatBase>
  );
}

/* ---------- 15–18: Quick replies ---------- */
function S15() {
  return <ChatBase messages={['date', 'dinner']} input="quick" links={QUICK} />;
}

function S16() {
  return (
    <ChatBase messages={['date', 'dinner']} input="selected" links={{ ...QUICK, send: '17', replies: ['15'] }}>
      <Glow x={241} y={742} w={142} h={88} r={22} width={4} glow={false} />
    </ChatBase>
  );
}

function S17() {
  const l = useL();
  return (
    <ChatBase messages={['date', 'dinner', 'okSent']} input="quick" links={QUICK}>
      <Banner title={l('Sent to Daughter', '已发送给女儿')} />
    </ChatBase>
  );
}

function SquareBtn({ icon, color = C.text, bg = C.chip, w = 48, h = 48, size = 24, to, label }) {
  const hot = useHot(to);
  return (
    <div
      {...hot}
      aria-label={label}
      style={{
        width: w,
        height: h,
        borderRadius: 12,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon name={icon} size={size} color={color} />
    </div>
  );
}

/**
 * Quick reply editor (18). The Full MVP passes the live list and handlers:
 * on = { up(i), down(i), edit(i), del(i), add, back, home }.
 */
export function ReplyEditor({ replies = QUICK_REPLIES, on = {}, max = 6, children }) {
  const l = useL();
  const full = replies.length >= max;
  const fn = (f, i) => (f ? () => f(i) : undefined);
  return (
    <Screen>
      <StatusBar />
      <NavBar title={['Quick replies', '快捷回复']} back={on.back || '15'} home={on.home || '01'} />
      <div
        className={on.back ? 'cm-scroll' : undefined}
        style={{
          flex: on.back ? 1 : undefined,
          minHeight: 0,
          overflowY: on.back ? 'auto' : undefined,
          boxSizing: 'border-box',
          padding: on.back ? '16px 16px 30px 16px' : '16px 16px 0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <T w={700} s={24} lh={29} nowrap>{l('Your quick replies', '我的快捷回复')}</T>
          <T s={16} lh={19} c={C.sub} nowrap>{l('Shown in every chat, up to 6', '在每个聊天中显示，最多6条')}</T>
        </div>
        {replies.map((r, i) => (
          <div
            key={r.en + i}
            style={{
              flexShrink: 0,
              height: 106,
              boxSizing: 'border-box',
              padding: '10px 12px 10px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: C.white,
              borderRadius: 16,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SquareBtn icon="chevron-up" h={40} color={i === 0 ? '#c4c4c4' : C.text} to={i > 0 ? fn(on.up, i) : undefined} label="Move up" />
              <SquareBtn
                icon="chevron-down"
                h={40}
                color={i === replies.length - 1 ? '#c4c4c4' : C.text}
                to={i < replies.length - 1 ? fn(on.down, i) : undefined}
                label="Move down"
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <T w={600} s={20} lh={24}>{l(r.en, r.cn)}</T>
            </div>
            <SquareBtn icon="pencil" to={fn(on.edit, i)} label="Edit" />
            <SquareBtn icon="trash" color="#d92d20" bg="#fdecec" to={fn(on.del, i)} label="Delete" />
          </div>
        ))}
        <T s={16} lh={19} c={C.sub} nowrap>
          {full && on.add
            ? l(`${max} of ${max} replies – delete one to add a new one`, `已有${max}条，删除一条才能添加`)
            : l(`${replies.length} of ${max} replies`, `已有${replies.length}条，最多${max}条`)}
        </T>
        <Btn
          kind="secondary"
          icon="plus"
          label="Add a reply"
          cn="添加回复"
          w={361}
          to={full ? undefined : on.add}
          style={full && on.add ? { opacity: 0.4 } : undefined}

        />
      </div>
      {children}
    </Screen>
  );
}

function S18() {
  return <ReplyEditor />;
}

/* ---------- registry ---------- */
export const SCREENS = {
  '01': { C: S01, title: 'Lite Mode Home', refs: 'US1, US9, US17 · F1 · FR-1.1–1.4', caption: 'Pinned family photos on the first screen; four fixed, labelled actions at the bottom; Settings lets the user edit contacts or switch back to standard WeChat.' },
  '02': { C: S02, title: 'Contact page', refs: 'US2, US3, US4, US6 · F2, F3 · FR-2.1, FR-3.1', caption: 'One tap on a photo opens three large labelled actions. Back and Home are always in the same place; Help sits in a fixed corner.' },
  '03': { C: S03, title: 'Chat with large text', refs: 'US4, US10, US15 · F2, F6 · FR-2.4, FR-6.1', caption: 'Large message text, a clear “Speak to type” option instead of small icons, and Read aloud / Show as text on incoming messages.' },
  '04': { C: S04, title: 'Voice message recorder', refs: 'US3, US5 · F2 · FR-2.2', caption: 'Tap once to start and tap Send to finish – no need to hold a finger down (replaces WeChat’s hold-to-talk). Visible timer and a large Cancel button.' },
  '05': { C: S05, title: 'Call confirmation', refs: 'US2, US12 · F2, F3 · FR-2.3', caption: 'Video Call is 2 taps from Home. A confirmation with photo and name prevents accidental calls; Cancel returns to the contact page and no call is made.' },
  '06': { C: S06, title: '“Sent” feedback', refs: 'US5 · F3 · FR-3.2', caption: 'After sending, a green banner “Sent to Daughter” stays for at least 3 seconds with a short vibration, so the user knows it worked.' },
  '07': { C: S07, title: 'Plain-language error', refs: 'US13 · F3 · FR-3.3', caption: 'Errors use simple words and offer one clear next step (“Try again”). No error codes or technical terms.' },
  '08': { C: S08, title: 'Ask family for help', refs: 'US8, US14 · F5 · FR-5.1 (Should)', caption: 'One tap on Help prepares a message with a screenshot of the current screen. Nothing is sent until the user taps “Send request”.' },
  '09': { C: S09, title: '“Show me how” guidance', refs: 'US7 · F4 · FR-4.1 (Should)', caption: 'Optional step-by-step help, shown only when the user taps “Show me how”. The current step is highlighted and the guide can be closed at any time.' },
  '10': { C: S10, title: 'Help menu', refs: 'US24 (Mr Ma) · Help button on Home', caption: 'Tapping Help opens a list of everyday tasks written as the user would say them. Picking one starts a short guide. Users can also say what they need, or ask family for help (screen 08).' },
  '11': { C: S11, title: 'Guide step 1 – pick a person', refs: 'US24 · coach mark on Home', caption: 'The screen dims and only the Daughter photo glows. A pointing hand shows exactly where to tap. A green bar at the top shows the guide is on and can be exited at any time.' },
  '12': { C: S12, title: 'Guide step 2 – choose “Send Message”', refs: 'US24 · coach mark on contact page', caption: 'Only the Send Message button is highlighted, so the user is not distracted by the other options. Each step gives one instruction at a time, with Read aloud.' },
  '13': { C: S13, title: 'Guide step 3 – type and send', refs: 'US24 · coach mark on chat', caption: 'The message box and Send button are highlighted. The guide explains both ways to write a message: typing, or speaking with “Speak to type”.' },
  '14': { C: S14, title: 'Guide finished', refs: 'US24 · positive feedback', caption: 'The guide ends with clear praise and the result (“You sent a message”). Users can practise again, and are told the guide is always available under Help.' },
  '15': { C: S15, title: 'Chat with quick replies', refs: 'US25 · FR-24, FR-26', caption: 'Four large reply buttons sit above the message box, so a user who finds typing hard can answer in two taps. “Edit” opens the list of replies.' },
  '16': { C: S16, title: 'Reply chosen – check, then Send', refs: 'US26 · FR-25, NFR-11', caption: 'Tapping “OK” only puts it in the message box (shown in dark text). The user can still edit or clear it. Nothing is sent until they tap Send.' },
  '17': { C: S17, title: 'Quick reply sent', refs: 'US26 · FR-25, FR-17', caption: 'The reply appears in the chat and the usual “Sent to Daughter” banner confirms it worked, just like a typed message.' },
  '18': { C: S18, title: 'Edit quick replies (Settings)', refs: 'US27 · FR-27', caption: 'The user or a family helper can add, edit, remove and reorder replies (up to 6). Reordering uses Up / Down buttons instead of dragging, which is hard with a hand tremor.' },
  '19': { C: WECHAT_SCREENS['19'], title: 'Standard WeChat (before Lite mode)', refs: 'Entry point · standard WeChat', caption: 'This is the normal WeChat look: small text, a dense chat list and icon-only tabs. Lite mode is switched on from here, through Me → Settings.' },
  '20': { C: WECHAT_SCREENS['20'], title: 'Settings – Lite mode toggle', refs: 'US1 · F1 · FR-1.1', caption: 'Lite mode is one toggle in Settings, with a plain description of what it changes, so a family member or the user can switch it on without searching through menus.' },
  '21': { C: WECHAT_SCREENS['21'], title: 'Confirm switching to Lite mode', refs: 'US1 · F1 · FR-1.1', caption: 'A preview of the Lite mode home screen and four short points explain the change. Chats and contacts stay the same, and the user can switch back in Settings at any time.' },
  '22': { C: S22, title: '“Sent” after Try again', refs: 'US5, US13 · F3 · FR-3.2, FR-3.3', caption: 'After “Try again” the message goes through: the warning icon is gone and the same green “Sent to Daughter” banner confirms it.' },
};

/* Chinese titles, captions and (where the English has words) refs */
const CN = {
  '01': ['沟通模式主页', '家人照片固定在首页；底部有四个固定、带文字的操作；在“设置”里可以编辑联系人或切换回普通微信。'],
  '02': ['联系人页面', '点一下照片，就会出现三个带文字的大按钮。“返回”和“主页”始终在同一位置；“帮助”固定在角落。'],
  '03': ['大字聊天', '消息文字更大，用清楚的“说话打字”代替小图标；收到的消息可以“朗读”或“转文字”。'],
  '04': ['录语音', '点一下开始，点“发送”结束，不用一直按住（取代微信的按住说话）。有计时器和大大的“取消”按钮。'],
  '05': ['通话确认', '从主页点两下就能视频通话。带照片和名字的确认页可防止误拨；点“取消”返回联系人页面，不会拨出电话。'],
  '06': ['“已发送”提示', '发送后，绿色横幅“已发送给女儿”至少显示3秒，并伴有短暂振动，让用户知道发送成功。'],
  '07': ['简单易懂的错误提示', '错误提示用简单的话，并给出一个清楚的下一步（“重试”）。没有错误代码或专业术语。'],
  '08': ['请家人帮忙', '点一下“帮助”，就会准备一条附有当前屏幕截图的消息。用户点“发送求助”之前不会发出任何内容。'],
  '09': ['“教我用”指导', '可选的分步帮助，只在用户点“教我用”时显示。当前步骤会被高亮，随时可以关闭教学。'],
  '10': ['帮助菜单', '点“帮助”会打开日常任务列表，用用户自己的话来描述。选一项就会开始简短的教学。用户也可以说出需求，或请家人帮忙（页面 08）。', 'US24（马先生）· 主页上的帮助按钮'],
  '11': ['教学第1步：选择联系人', '屏幕变暗，只有女儿的照片在发光。手指图标指出要点的位置。顶部的绿色横条表示正在教学，随时可以退出。', 'US24 · 主页上的教学提示'],
  '12': ['教学第2步：选择“发消息”', '只高亮“发消息”按钮，避免用户被其他选项分心。每一步只给一个提示，并可以朗读。', 'US24 · 联系人页面上的教学提示'],
  '13': ['教学第3步：输入并发送', '输入框和“发送”按钮被高亮。教学说明两种写消息的方法：打字，或用“说话打字”。', 'US24 · 聊天页面上的教学提示'],
  '14': ['教学完成', '教学最后给予明确的鼓励和结果（“你发出了消息”）。用户可以再练一次，并知道在“帮助”里随时能找到这个教学。', 'US24 · 正面反馈'],
  '15': ['带快捷回复的聊天', '输入框上方有四个大的回复按钮，打字困难的用户点两下就能回复。点“编辑”可以打开回复列表。'],
  '16': ['选好回复，确认后发送', '点“好的”只会把它放进输入框（深色文字）。用户仍可以修改或清除，点“发送”之前不会发出。'],
  '17': ['快捷回复已发送', '回复出现在聊天中，和打字发送的消息一样，会显示“已发送给女儿”横幅确认。'],
  '19': ['普通微信（切换前）', '这是普通微信的样子：字小、聊天列表密集、底部只有图标标签。从这里经过“我 → 设置”打开简易模式。', '入口 · 普通微信'],
  '20': ['设置：简易模式开关', '简易模式只是设置里的一个开关，并用简单的话说明会改变什么，家人或用户自己不用翻找菜单就能打开。'],
  '21': ['确认切换到简易模式', '预览简易模式的主页，并用四句话说明变化。聊天记录和联系人不变，随时可以在设置里切换回来。'],
  '22': ['重试后“已发送”', '点“重试”后消息发出：警告图标消失，同样的绿色“已发送给女儿”横幅确认发送成功。'],
  '18': ['编辑快捷回复（设置）', '用户或家人可以添加、编辑、删除和排序回复（最多6条）。排序用“上移/下移”按钮代替拖动，手抖的用户也能轻松操作。'],
};
for (const id in CN) [SCREENS[id].titleCn, SCREENS[id].captionCn, SCREENS[id].refsCn = SCREENS[id].refs] = CN[id];
