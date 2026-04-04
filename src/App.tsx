import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  Calendar as CalendarIcon, 
  Users, 
  MessageSquareWarning, 
  BatteryLow, 
  Wifi, 
  Signal,
  Phone,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock
} from 'lucide-react';

const LockScreen = ({ onUnlock, time }: { onUnlock: () => void, time: Date }) => {
  const [passcode, setPasscode] = useState('');
  const [shake, setShake] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [isHorrorMode, setIsHorrorMode] = useState(false);
  const [failMessage, setFailMessage] = useState('');

  const handleScreenClick = () => {
    if (isHorrorMode) {
      setIsHorrorMode(false);
      setFailCount(0);
      setPasscode('');
    }
  };

  const handlePress = (num: string) => {
    if (isHorrorMode) return;
    if (passcode.length < 4) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      if (newPasscode.length === 4) {
        if (newPasscode === '0628') {
          setTimeout(onUnlock, 300);
        } else {
          const newFailCount = failCount + 1;
          setFailCount(newFailCount);
          
          if (newFailCount % 5 === 0) {
            setTimeout(() => {
              setIsHorrorMode(true);
            }, 300);
          } else {
            if (newFailCount % 5 === 3) {
              setFailMessage('좀 더 잘해 봐.');
            } else if (newFailCount % 5 === 4) {
              setFailMessage('자기야.');
            }
            setShake(true);
            setTimeout(() => {
              setPasscode('');
              setShake(false);
              setFailMessage('');
            }, 800);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (isHorrorMode) return;
    setPasscode(prev => prev.slice(0, -1));
  }

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="absolute inset-0 z-20 flex flex-col items-center pt-20 bg-black"
      onClick={handleScreenClick}
    >
      <motion.div 
        animate={{ opacity: isHorrorMode ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=1000&auto=format&fit=crop")' }}
      />
      <motion.div 
        animate={{ opacity: isHorrorMode ? 0 : 1 }} 
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"
      />
      
      <div className="relative z-10 flex flex-col items-center w-full h-full">
        <div className="text-6xl font-light text-white mb-2 tracking-wider">
          {time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <div className="text-white/90 text-lg mb-16">
          2026년 7월 1일 수요일
        </div>

        <motion.div 
          animate={{ color: isHorrorMode ? '#ef4444' : '#ffffff' }}
          transition={{ duration: 0.3 }}
          className={`mb-6 font-medium relative z-10 ${isHorrorMode ? 'animate-glitch font-bold drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : ''}`}
        >
          {isHorrorMode ? '넌 아무것도 몰라도 돼.' : failMessage ? failMessage : (passcode.length > 0 ? '비밀번호 입력' : '비밀번호를 입력하여 잠금 해제')}
        </motion.div>

        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className={`flex gap-4 mb-12 transition-opacity duration-1000 ${isHorrorMode ? 'opacity-30' : 'opacity-100'}`}
        >
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full border border-white transition-colors ${i < passcode.length ? 'bg-white' : 'bg-transparent'}`} />
          ))}
        </motion.div>

        <div className={`grid grid-cols-3 gap-x-8 gap-y-6 transition-opacity duration-1000 ${isHorrorMode ? 'pointer-events-none opacity-30' : 'opacity-100'}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              onClick={(e) => { e.stopPropagation(); handlePress(num.toString()); }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white text-2xl font-light flex items-center justify-center active:bg-white/40 transition-colors"
            >
              {num}
            </button>
          ))}
          <div />
          <button 
            onClick={(e) => { e.stopPropagation(); handlePress('0'); }}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white text-2xl font-light flex items-center justify-center active:bg-white/40 transition-colors"
          >
            0
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="w-16 h-16 rounded-full text-white text-sm font-medium flex items-center justify-center active:opacity-50 transition-opacity"
          >
            취소
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const AppIcon = ({ icon, name, color, onClick, noLabel }: any) => (
  <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={onClick}>
    <motion.div 
      whileTap={{ scale: 0.9 }}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow ${color}`}
    >
      {icon}
    </motion.div>
    {!noLabel && <span className="text-[11px] font-medium text-gray-700">{name}</span>}
  </div>
)

const HomeScreen = ({ openApp }: { openApp: (app: string) => void }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#e0f2fe] via-[#fce7f3] to-[#ccfbf1] pt-16 px-5 pb-6 flex flex-col relative">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* App Grid */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-8 relative z-10">
        <AppIcon icon={<CalendarIcon size={28} className="text-white" />} name="캘린더" color="bg-gradient-to-b from-pink-400 to-pink-500" onClick={() => openApp('calendar')} />
        <AppIcon icon={<Users size={28} className="text-white" />} name="연락처" color="bg-gradient-to-b from-green-400 to-green-500" onClick={() => openApp('contacts')} />
        <AppIcon icon={<MessageSquareWarning size={28} className="text-white" />} name="Secret" color="bg-gradient-to-b from-gray-800 to-black" onClick={() => openApp('dark-messenger')} />
      </div>

      {/* Dock */}
      <div className="mt-auto bg-white/40 backdrop-blur-xl rounded-[32px] p-4 flex justify-around relative z-10 shadow-sm border border-white/50">
        <AppIcon icon={<Phone size={28} className="text-white" />} color="bg-gradient-to-b from-green-400 to-green-500" noLabel />
        <AppIcon icon={<MessageCircle size={28} className="text-white" />} color="bg-gradient-to-b from-blue-400 to-blue-500" onClick={() => openApp('messenger')} noLabel />
        <AppIcon icon={<Globe size={28} className="text-white" />} color="bg-gradient-to-b from-blue-400 to-blue-500" noLabel />
      </div>
    </div>
  )
}

const AppWrapper = ({ children, onClose, isDark }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full h-full absolute top-0 left-0 z-20 flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="flex-1 w-full h-full overflow-hidden">
        {children}
      </div>
      {/* Home Indicator */}
      <div className="absolute bottom-1 w-full h-6 flex justify-center items-center z-50 cursor-pointer" onClick={onClose}>
        <div className={`w-1/3 h-1.5 rounded-full transition-colors ${isDark ? 'bg-white/50 hover:bg-white/80' : 'bg-black/30 hover:bg-black/50'}`} />
      </div>
    </motion.div>
  )
}

const MessengerApp = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col h-full bg-[#f0f4f8]">
    <div className="pt-12 pb-3 px-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center gap-3 z-10">
      <button onClick={onClose} className="p-1 -ml-1 cursor-pointer active:opacity-50"><ChevronLeft size={24} className="text-blue-500" /></button>
      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm text-sm">자기</div>
      <span className="font-semibold text-lg">내 자기❤</span>
    </div>
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="text-center text-xs text-gray-400 my-2">2026년 7월 1일 수요일</div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-[10px] shadow-sm mt-1">자기</div>
        <div className="flex flex-col gap-1">
          <div className="self-start bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
            갈 준비는 다 했어?
          </div>
          <span className="text-[10px] text-gray-400 ml-1">오후 5:30</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col gap-1 self-end items-end mt-2">
        <div className="bg-blue-500 text-white shadow-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
          응. 선물 준비도 끝났지요.🥳
        </div>
        <span className="text-[10px] text-gray-400 mr-1">오후 5:32</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex gap-2 mt-2">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold text-[10px] shadow-sm mt-1">자기</div>
        <div className="flex flex-col gap-1">
          <div className="self-start bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
            그건 안 해도 되는데...
          </div>
          <span className="text-[10px] text-gray-400 ml-1">오후 5:34</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex flex-col gap-1 self-end items-end mt-2">
        <div className="bg-blue-500 text-white shadow-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
          그런 말하지마.
        </div>
        <span className="text-[10px] text-gray-400 mr-1">오후 5:36</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }} className="flex flex-col gap-1 self-end items-end mt-1">
        <div className="bg-blue-500 text-white shadow-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
          이번 달 내내 고생했잖아.
        </div>
        <span className="text-[10px] text-gray-400 mr-1">오후 5:38</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="flex flex-col gap-1 self-end items-end mt-1">
        <div className="bg-blue-500 text-white shadow-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
          자기는 받을 자격 있어.✊
        </div>
        <span className="text-[10px] text-gray-400 mr-1">오후 5:40</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.0 }} className="flex flex-col gap-1 self-end items-end mt-1">
        <div className="bg-blue-500 text-white shadow-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
          이따가 퇴근하고 나서 봐.😘
        </div>
        <span className="text-[10px] text-gray-400 mr-1">오후 5:42</span>
      </motion.div>
    </div>
  </div>
)

const DarkMessengerApp = ({ onClose }: { onClose: () => void }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [shake, setShake] = useState(false);

  const handlePress = (num: string) => {
    if (passcode.length < 4) {
      const newPasscode = passcode + num;
      setPasscode(newPasscode);
      if (newPasscode.length === 4) {
        if (newPasscode === '0229') {
          setTimeout(() => setIsUnlocked(true), 300);
        } else {
          setShake(true);
          setTimeout(() => {
            setPasscode('');
            setShake(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => setPasscode(prev => prev.slice(0, -1));

  if (!isUnlocked) {
    return (
      <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-200 items-center relative">
        <div className="w-full px-4 pt-12 pb-3 flex items-center gap-3 absolute top-0 z-10">
          <button onClick={onClose} className="p-1 -ml-1 cursor-pointer active:opacity-50"><ChevronLeft size={24} className="text-red-500" /></button>
        </div>
        <div className="mt-32 mb-12 text-xl font-medium tracking-widest text-red-500">SECRET ACCESS</div>
        <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }} className="flex gap-4 mb-16">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3.5 h-3.5 rounded-full border border-red-500 transition-colors ${i < passcode.length ? 'bg-red-500' : 'bg-transparent'}`} />
          ))}
        </motion.div>
        <div className="grid grid-cols-3 gap-x-8 gap-y-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handlePress(num.toString())} className="w-16 h-16 rounded-full bg-red-900/10 text-red-500 text-2xl font-light flex items-center justify-center active:bg-red-900/30 transition-colors border border-red-900/30">{num}</button>
          ))}
          <div />
          <button onClick={() => handlePress('0')} className="w-16 h-16 rounded-full bg-red-900/10 text-red-500 text-2xl font-light flex items-center justify-center active:bg-red-900/30 transition-colors border border-red-900/30">0</button>
          <button onClick={handleDelete} className="w-16 h-16 rounded-full text-red-500 text-sm font-medium flex items-center justify-center active:opacity-50 transition-opacity">취소</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-200">
      <div className="pt-12 pb-3 px-4 bg-black/80 backdrop-blur-md border-b border-gray-800 flex items-center gap-3 z-10">
        <button onClick={onClose} className="p-1 -ml-1 cursor-pointer active:opacity-50"><ChevronLeft size={24} className="text-red-500" /></button>
        <div className="w-9 h-9 rounded-full bg-red-950 border border-red-900 flex items-center justify-center text-red-500 font-bold shadow-[0_0_10px_rgba(220,38,38,0.3)]">X</div>
        <span className="font-semibold text-lg text-red-500 tracking-widest">UNKNOWN</span>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="text-center text-xs text-gray-600 my-2">2026년 7월 1일 수요일</div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-1 self-end items-end mt-2">
          <div className="bg-red-900/40 border border-red-900/50 text-red-100 shadow-[0_0_15px_rgba(220,38,38,0.15)] rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
            준비는요?
          </div>
          <span className="text-[10px] text-gray-600 mr-1">오후 11:45</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-red-950 border border-red-900 flex-shrink-0 flex items-center justify-center text-red-500 font-bold text-xs mt-1">X</div>
          <div className="flex flex-col gap-1">
            <div className="self-start bg-gray-900 border border-gray-800 shadow-md rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed text-gray-300">
              끝났어요.
            </div>
            <span className="text-[10px] text-gray-600 ml-1">오후 11:47</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-col gap-1 self-end items-end mt-2">
          <div className="bg-red-900/40 border border-red-900/50 text-red-100 shadow-[0_0_15px_rgba(220,38,38,0.15)] rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
            사후 처리도 잘 부탁해요.
          </div>
          <span className="text-[10px] text-gray-600 mr-1">오후 11:49</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex gap-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-red-950 border border-red-900 flex-shrink-0 flex items-center justify-center text-red-500 font-bold text-xs mt-1">X</div>
          <div className="flex flex-col gap-1">
            <div className="self-start bg-gray-900 border border-gray-800 shadow-md rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed text-gray-300">
              걱정 마세요. 약도 잘 구해뒀으니까.
            </div>
            <span className="text-[10px] text-gray-600 ml-1">오후 11:51</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0 }} className="flex flex-col gap-1 self-end items-end mt-2">
          <div className="bg-red-900/40 border border-red-900/50 text-red-100 shadow-[0_0_15px_rgba(220,38,38,0.15)] rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[280px] text-[15px] leading-relaxed">
            ......
          </div>
          <span className="text-[10px] text-gray-600 mr-1">오후 11:53</span>
        </motion.div>
      </div>
    </div>
  );
}

const SecretDiaryApp = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-gray-200">
      <div className="pt-12 pb-3 px-4 bg-black/80 backdrop-blur-md border-b border-red-900/30 flex items-center gap-3 z-10 sticky top-0">
        <button onClick={onClose} className="p-1 -ml-1 cursor-pointer active:opacity-50"><ChevronLeft size={24} className="text-red-600" /></button>
        <div className="w-9 h-9 rounded-full bg-red-950/50 border border-red-900/50 flex items-center justify-center text-red-600 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
          <Lock size={16} />
        </div>
        <span className="font-semibold text-lg text-red-600 tracking-wider">우리의 사랑 이야기</span>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto bg-[#0a0a0a]">
        {/* Post-it 1 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#fef08a] text-gray-900 p-5 rounded-sm shadow-md rotate-[-2deg] self-start max-w-[85%]">
          <p className="font-serif font-medium text-[15px] leading-relaxed">2월 29일, 우리는 처음 만났어요.</p>
        </motion.div>

        {/* Post-it 2 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#e2e8f0] text-gray-900 p-5 rounded-sm shadow-md rotate-[1deg] self-end max-w-[85%]">
          <p className="font-serif font-medium text-[15px] leading-relaxed">형이 당신과 결혼한다고 했어요.<br/>그날 정말 많이 울었어요.</p>
        </motion.div>

        {/* Post-it 3 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="bg-[#374151] text-gray-100 p-5 rounded-sm shadow-md rotate-[-1deg] self-start max-w-[80%] border border-gray-600">
          <p className="font-serif font-medium text-[15px] leading-relaxed">왜 나는 안되나요.</p>
        </motion.div>

        {/* Post-it 4 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="bg-[#fef08a] text-red-700 p-5 rounded-sm shadow-md rotate-[2deg] self-center w-[95%] max-w-[95%]">
          <p className="font-serif font-bold text-[16px] leading-tight break-all tracking-tighter">
            {Array(40).fill("내거야").join("")}
          </p>
        </motion.div>

        {/* Post-it 5 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} className="bg-black border border-red-900 text-red-600 p-5 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.15)] rotate-[-2deg] self-end max-w-[90%] mt-4 mb-8">
          <p className="font-serif font-medium text-[16px] leading-relaxed tracking-wide">당신이 온전히 ‘나’를 보지 않겠다면.</p>
        </motion.div>
      </div>
    </div>
  )
}

const CalendarApp = ({ onClose, openApp, currentMonth, setCurrentMonth }: { onClose: () => void, openApp: (app: string) => void, currentMonth: number, setCurrentMonth: React.Dispatch<React.SetStateAction<number>> }) => {
  const [isFeb29Triggered, setIsFeb29Triggered] = useState(false);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  
  const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month - 1, 1).getDay();

  const daysInMonth = getDaysInMonth(2026, currentMonth);
  const firstDay = getFirstDayOfMonth(2026, currentMonth);
  const dates = Array.from({length: daysInMonth}, (_, i) => i + 1);
  const emptySlots = Array.from({length: firstDay}, (_, i) => i);

  const events = [
    { month: 6, date: 28, title: '결혼기념일💖', color: 'bg-pink-400' },
    { month: 6, date: 28, title: '생일', color: 'bg-blue-400' },
    { month: 6, date: 29, title: '은성이 생일', color: 'bg-green-400' },
  ];

  const currentMonthEvents = events.filter(e => e.month === currentMonth);

  const handleDateClick = (date: number) => {
    if (currentMonth === 2 && date === 28) {
      setIsFeb29Triggered(true);
      setTimeout(() => {
        openApp('secret-diary');
        setTimeout(() => setIsFeb29Triggered(false), 500);
      }, 1200);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="pt-12 pb-4 px-5 border-b border-gray-100 flex items-center justify-between bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 -ml-2 cursor-pointer active:opacity-50"><ChevronLeft size={24} className="text-gray-800" /></button>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{currentMonth}월</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(prev => Math.max(1, prev - 1))} className="p-2 active:opacity-50"><ChevronLeft size={20} className="text-gray-600"/></button>
          <button onClick={() => setCurrentMonth(prev => Math.min(12, prev + 1))} className="p-2 active:opacity-50"><ChevronRight size={20} className="text-gray-600"/></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium mb-4 text-gray-400">
            {days.map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center text-[15px]">
            {emptySlots.map(i => <div key={`empty-${i}`} className="text-transparent">0</div>)}
            {dates.map((date) => {
              const dayEvents = currentMonthEvents.filter(e => e.date === date);
              let displayDate: number | string = date;
              let isTriggered = false;
              
              if (currentMonth === 2 && date === 28 && isFeb29Triggered) {
                displayDate = 29;
                isTriggered = true;
              }

              return (
                <div key={date} onClick={() => handleDateClick(date)} className={`aspect-square flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-50 rounded-full transition-colors ${isTriggered ? 'bg-red-900/10' : ''}`}>
                  <span className={`${currentMonth === 7 && date === 1 && !isTriggered ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center' : (isTriggered ? 'text-red-600 font-bold text-lg animate-pulse' : 'text-gray-700')}`}>
                    {displayDate}
                  </span>
                  {dayEvents.length > 0 && !isTriggered && (
                    <div className="absolute bottom-0 flex gap-0.5">
                      {dayEvents.map((e, idx) => <div key={idx} className={`w-1 h-1 rounded-full ${e.color}`}></div>)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="px-5 py-6 bg-[#f8fafc] min-h-[300px] border-t border-gray-100">
          <h2 className="font-semibold mb-4 text-gray-800 text-lg">다가오는 일정</h2>
          <div className="flex flex-col gap-3">
            {currentMonthEvents.length > 0 ? currentMonthEvents.map((e, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.02 }} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className={`w-1.5 h-12 rounded-full ${e.color}`}></div>
                <div>
                  <div className="font-semibold text-gray-800">{e.title}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{currentMonth}월 {e.date}일</div>
                </div>
              </motion.div>
            )) : (
              <div className="text-gray-400 text-sm py-4">일정이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const ContactsApp = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col h-full bg-white">
    <div className="pt-12 pb-5 px-5 border-b border-gray-100 bg-white/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onClose} className="p-1 -ml-2 cursor-pointer active:opacity-50"><ChevronLeft size={24} className="text-gray-800" /></button>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">연락처</h1>
      </div>
      <div className="mt-4 bg-gray-100 rounded-xl px-4 py-3 text-[15px] text-gray-500 flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        검색
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-5 pb-10">
      <div className="mb-6">
        <div className="text-sm font-bold text-gray-400 mb-3 px-1">ㄱ</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">관</div>
            <span className="font-medium text-gray-800 text-[17px]">관은성</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="text-sm font-bold text-gray-400 mb-3 px-1">ㄴ</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-[11px]">자기</div>
            <span className="font-medium text-gray-800 text-[17px]">내 자기❤</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <div className="text-sm font-bold text-gray-400 mb-3 px-1">ㅇ</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-lg">아</div>
            <span className="font-medium text-gray-800 text-[17px]">아버지</span>
          </div>
          <div className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-semibold text-lg">어</div>
            <span className="font-medium text-gray-800 text-[17px]">어머니</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lock');
  const [time, setTime] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(7);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isDarkApp = currentScreen === 'dark-messenger' || currentScreen === 'secret-diary';

  return (
    <div className="w-full h-[100dvh] bg-white relative overflow-hidden font-sans selection:bg-blue-200">
      {/* Status Bar */}
      <div className={`absolute top-0 w-full h-12 flex justify-between items-center px-6 z-50 text-xs font-medium transition-colors duration-300 ${currentScreen === 'lock' || isDarkApp ? 'text-white' : 'text-gray-800'}`}>
        <span className="mt-1">{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        <div className="flex items-center gap-1.5 mt-1">
          <Signal size={14} />
          <Wifi size={14} />
          <BatteryLow size={16} className={currentScreen === 'lock' || isDarkApp ? 'text-red-400' : 'text-red-500'} />
        </div>
      </div>

      {/* Screen Content */}
      <div className="relative w-full h-full bg-white overflow-hidden">
        <AnimatePresence>
          {currentScreen === 'lock' && (
            <LockScreen key="lock" onUnlock={() => setCurrentScreen('home')} time={time} />
          )}
        </AnimatePresence>
        
        {currentScreen !== 'lock' && (
          <div className="absolute inset-0">
            <HomeScreen openApp={setCurrentScreen} />
          </div>
        )}

        <AnimatePresence>
          {currentScreen === 'messenger' && (
            <AppWrapper key="messenger" onClose={() => setCurrentScreen('home')}>
              <MessengerApp onClose={() => setCurrentScreen('home')} />
            </AppWrapper>
          )}

          {currentScreen === 'calendar' && (
            <AppWrapper key="calendar" onClose={() => setCurrentScreen('home')}>
              <CalendarApp onClose={() => setCurrentScreen('home')} openApp={setCurrentScreen} currentMonth={calendarMonth} setCurrentMonth={setCalendarMonth} />
            </AppWrapper>
          )}

          {currentScreen === 'secret-diary' && (
            <AppWrapper key="secret-diary" onClose={() => setCurrentScreen('calendar')} isDark>
              <SecretDiaryApp onClose={() => setCurrentScreen('calendar')} />
            </AppWrapper>
          )}

          {currentScreen === 'contacts' && (
            <AppWrapper key="contacts" onClose={() => setCurrentScreen('home')}>
              <ContactsApp onClose={() => setCurrentScreen('home')} />
            </AppWrapper>
          )}

          {currentScreen === 'dark-messenger' && (
            <AppWrapper key="dark-messenger" onClose={() => setCurrentScreen('home')} isDark>
              <DarkMessengerApp onClose={() => setCurrentScreen('home')} />
            </AppWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
