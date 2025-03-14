// BTS Members Data
const members = [
    {
        name: "BTS",
        koreanName: "방탄소년단",
        theme: "bts-theme",
        emoji: "💜",
        isDebut: true,
        debutDateStr: "2025-06-13"  // 12th anniversary
    },
    {
        name: "Jin",
        koreanName: "김석진",
        status: "discharged",
        theme: "jin-theme",
        emoji: "🐹",
        specialLink: "https://www.youtube.com/watch?v=7fszwWLFAng&list=PL5hrGMysD_Gul2yY_d_zOxx25e2vXMAYA"
    },
    {
        name: "J-Hope",
        koreanName: "정호석",
        status: "discharged",
        theme: "jhope-theme",
        emoji: "🌞",
        specialLink: "https://www.youtube.com/@BTS"
    },
    {
        name: "Suga",
        koreanName: "민윤기",
        dischargeDateStr: "2025-06-21",
        theme: "suga-theme",
        emoji: "🐱"
    },
    {
        name: "RM",
        koreanName: "김남준",
        dischargeDateStr: "2025-06-10",
        theme: "rm-theme",
        emoji: "🐨"
    },
    {
        name: "Jimin",
        koreanName: "박지민",
        dischargeDateStr: "2025-06-11",
        theme: "jimin-theme",
        emoji: "🐥"
    },
    {
        name: "V",
        koreanName: "김태형",
        dischargeDateStr: "2025-06-10",
        theme: "v-theme",
        emoji: "🐯"
    },
    {
        name: "Jungkook",
        koreanName: "전정국",
        dischargeDateStr: "2025-06-11",
        theme: "jungkook-theme",
        emoji: "🐰"
    }
];

// Background images array
const backgroundImages = [
    'assets/00651Opsgy1hqdiwiilbuj32bc1jkb2a.jpg',
    'assets/CUgUGiPUAAAaucF.jpg',
    'assets/CUgUEzxVEAAEZ2B.jpg',
    'assets/OTMswK.jpg',
    'assets/cffb5c5b3929c50bc3b8cc5ace3c1147.jpeg'
];

// Background music array
const musicList = [
    'assets/music/BTS (防弹少年团) - Spring Day.mp3',
    'assets/music/BTS (防弹少年团) - Magic Shop.mp3',
    'assets/music/BTS (防弹少年团) - Euphoria.mp3',
    'assets/music/BTS (防弹少年团) - Butterfly.mp3',
    'assets/music/BTS (防弹少年团) - I NEED U.mp3',
    'assets/music/BTS (防弹少年团) - FAKE LOVE (Rocking Vibe Mix).mp3',
    'assets/music/BTS(防弹少年团)-Yet To Come.mp3',
    'assets/music/BTS(防弹少年团)-Life Goes On.mp3'
];

let currentMusicIndex = 0;
let bgMusic;

function getSongName(path) {
    // 从路径中提取歌曲名
    const fileName = path.split('/').pop();
    return fileName.replace('.mp3', '').replace('BTS (防弹少年团) - ', '').replace('BTS(防弹少年团)-', '');
}

function updateNowPlaying() {
    const songNameElement = document.querySelector('.song-name');
    songNameElement.textContent = '正在播放：' + getSongName(musicList[currentMusicIndex]);
}

function playNextSong() {
    currentMusicIndex = (currentMusicIndex + 1) % musicList.length;
    bgMusic.src = musicList[currentMusicIndex];
    bgMusic.play();
    updateNowPlaying();
}

function playPrevSong() {
    currentMusicIndex = (currentMusicIndex - 1 + musicList.length) % musicList.length;
    bgMusic.src = musicList[currentMusicIndex];
    bgMusic.play();
    updateNowPlaying();
}

function playRandomSong() {
    const newIndex = Math.floor(Math.random() * musicList.length);
    currentMusicIndex = newIndex;
    bgMusic.src = musicList[currentMusicIndex];
    bgMusic.play();
    updateNowPlaying();
}

function initializeBackgroundMusic() {
    currentMusicIndex = Math.floor(Math.random() * musicList.length);
    bgMusic = new Audio(musicList[currentMusicIndex]);
    bgMusic.volume = 0.3;  // 设置适中的音量
    
    const musicBtn = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const prevBtn = document.getElementById('prevSong');
    const nextBtn = document.getElementById('nextSong');
    const randomBtn = document.getElementById('randomSong');
    const musicPanel = document.querySelector('.music-panel');
    
    // 更新当前播放歌曲名称
    updateNowPlaying();
    
    // 音乐结束时随机播放下一首
    bgMusic.addEventListener('ended', () => {
        playRandomSong();
    });
    
    // 尝试自动播放
    const tryAutoPlay = async () => {
        try {
            // 创建一个静音的音频上下文来解除浏览器限制
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.resume();
            
            // 尝试播放音乐
            await bgMusic.play();
            musicBtn.classList.add('playing');
        } catch (error) {
            console.log('等待用户交互后自动播放');
            // 如果自动播放失败，等待用户首次交互
            const autoPlayHandler = async () => {
                await bgMusic.play();
                musicBtn.classList.add('playing');
                document.removeEventListener('click', autoPlayHandler);
            };
            document.addEventListener('click', autoPlayHandler, { once: true });
        }
    };
    
    // 页面加载后尝试自动播放
    tryAutoPlay();
    
    // 控制面板显示状态
    let isPanelVisible = false;
    let lastClickTime = 0;
    
    // 音乐控制按钮事件
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const currentTime = new Date().getTime();
        
        // 检测双击（两次点击间隔小于300毫秒）
        if (currentTime - lastClickTime < 300) {
            // 双击：控制音乐播放/暂停
            if (bgMusic.paused) {
                bgMusic.play();
                musicBtn.classList.add('playing');
            } else {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
            }
        } else {
            // 单击：显示/隐藏控制面板
            isPanelVisible = !isPanelVisible;
            if (isPanelVisible) {
                musicPanel.classList.add('show');
            } else {
                musicPanel.classList.remove('show');
            }
        }
        
        lastClickTime = currentTime;
    });
    
    // 点击面板内部不关闭面板
    musicPanel.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 点击页面其他地方关闭面板
    document.addEventListener('click', () => {
        if (isPanelVisible) {
            isPanelVisible = false;
            musicPanel.classList.remove('show');
        }
    });
    
    // 音量控制
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value / 100;
    });
    
    // 上一首/下一首/随机播放
    prevBtn.addEventListener('click', playPrevSong);
    nextBtn.addEventListener('click', playNextSong);
    randomBtn.addEventListener('click', playRandomSong);
    
    // 监听音乐播放状态
    bgMusic.addEventListener('play', () => {
        musicBtn.classList.add('playing');
    });
    
    bgMusic.addEventListener('pause', () => {
        musicBtn.classList.remove('playing');
    });
}

// Initialize countdown cards
function initializeCountdown() {
    const grid = document.querySelector('.member-countdown-grid');
    
    members.forEach(member => {
        const card = document.createElement('div');
        card.className = `countdown-card ${member.theme}`;
        
        if (member.isDebut) {
            const debutDate = luxon.DateTime.fromISO(member.debutDateStr);
            card.innerHTML = `
                <div class="member-emoji">${member.emoji}</div>
                <h3>${member.name} (${member.koreanName})</h3>
                <p class="countdown-label">距离出道12周年还有</p>
                <div class="countdown" data-discharge="${member.debutDateStr}">
                    <div class="countdown-values">
                        <span class="days">0</span>天
                        <span class="hours">0</span>时
                        <span class="minutes">0</span>分
                        <span class="seconds">0</span>秒
                    </div>
                </div>
            `;
        } else if (member.status === "discharged") {
            card.innerHTML = `
                <div class="member-emoji">${member.emoji}</div>
                <h3>${member.name} (${member.koreanName})</h3>
                <p>已退伍</p>
                <a href="${member.specialLink}" target="_blank" class="btn btn-purple">查看相关内容</a>
            `;
        } else {
            const dischargeDate = luxon.DateTime.fromISO(member.dischargeDateStr);
            card.innerHTML = `
                <div class="member-emoji">${member.emoji}</div>
                <h3>${member.name} (${member.koreanName})</h3>
                <div class="countdown" data-discharge="${member.dischargeDateStr}">
                    <div class="countdown-values">
                        <span class="days">0</span>天
                        <span class="hours">0</span>时
                        <span class="minutes">0</span>分
                        <span class="seconds">0</span>秒
                    </div>
                </div>
            `;
        }
        
        grid.appendChild(card);
    });
}

// Update countdown timers
function updateCountdowns() {
    const now = luxon.DateTime.local();
    document.querySelectorAll('.countdown').forEach(countdown => {
        const discharge = luxon.DateTime.fromISO(countdown.dataset.discharge);
        const diff = discharge.diff(now, ['days', 'hours', 'minutes', 'seconds']);
        
        countdown.querySelector('.days').textContent = Math.floor(diff.days);
        countdown.querySelector('.hours').textContent = Math.floor(diff.hours);
        countdown.querySelector('.minutes').textContent = Math.floor(diff.minutes);
        countdown.querySelector('.seconds').textContent = Math.floor(diff.seconds);
    });
}

// Video handling functions
function addVideo(videoPath, title, subtitle, frameIndex) {
    const videoPlaceholder = document.querySelectorAll('.video-placeholder')[frameIndex];
    videoPlaceholder.innerHTML = `
        <video controls>
            <source src="${videoPath}" type="video/mp4">
            您的浏览器不支持视频播放。
        </video>
        <h4 class="video-title">${title}</h4>
        <p class="video-subtitle">${subtitle}</p>
    `;

    // 获取新添加的视频元素
    const video = videoPlaceholder.querySelector('video');
    
    // 添加视频播放/暂停事件监听
    video.addEventListener('play', () => {
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
        }
    });
    
    video.addEventListener('pause', () => {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play();
        }
    });
    
    video.addEventListener('ended', () => {
        if (bgMusic && bgMusic.paused) {
            bgMusic.play();
        }
    });
}

// Message handling
let messages = [];
let selectedEmoji = '💜';

// Initialize emoji selector
function initializeEmojiSelector() {
    document.querySelectorAll('.emoji-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.emoji-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedEmoji = option.dataset.emoji;
        });
    });
    // Set default selected emoji
    document.querySelector('.emoji-option').classList.add('selected');
}

function addMessage() {
    const content = document.getElementById('messageContent').value;
    
    if (!content) {
        alert('请输入留言内容！');
        return;
    }
    
    const message = {
        id: Date.now(),
        content,
        emoji: selectedEmoji,
        timestamp: new Date().toISOString()
    };
    
    messages.push(message);
    renderMessages();
    clearMessageForm();
}

function deleteMessage(id) {
    messages = messages.filter(msg => msg.id !== id);
    renderMessages();
}

function renderMessages() {
    const messageGrid = document.querySelector('.message-grid');
    messageGrid.innerHTML = '';
    
    messages.forEach(message => {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.innerHTML = `
            <div class="message-content">
                ${message.emoji} ${message.content}
            </div>
            <button class="delete-message" onclick="deleteMessage(${message.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        messageGrid.appendChild(messageCard);
    });
}

function clearMessageForm() {
    document.getElementById('messageContent').value = '';
}

// Set random background
function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    document.body.style.background = `url('${backgroundImages[randomIndex]}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setRandomBackground();
    initializeCountdown();
    initializeEmojiSelector();
    initializeBackgroundMusic();
    setInterval(updateCountdowns, 1000);
    
    // Add videos with titles and subtitles (swapped order)
    addVideo(
        'assets/videos/vp_output_1741827164724.mp4',
        'BTS 视频',
        '粉丝自制',
        0
    );
    addVideo(
        'assets/videos/lv_0_20250313160145.mp4',
        'BTS 视频',
        '粉丝自制',
        1
    );
}); 