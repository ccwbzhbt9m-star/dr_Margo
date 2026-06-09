let isOpened = false;

// Функция проверки пересечения двух фото
function isOverlapping(pos1, pos2, size = 120, minDistance = 130) {
    const dx = pos1.left - pos2.left;
    const dy = pos1.top - pos2.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDistance;
}

// Функция проверки пересечения с видео
function isOverlappingWithVideo(left, top, size = 120) {
    const videoElem = document.getElementById('videoCenter');
    if (!videoElem || videoElem.style.display === 'none') return false;
    
    const videoRect = videoElem.getBoundingClientRect();
    const margin = 25;
    
    const photoRight = left + size;
    const photoBottom = top + size;
    const videoLeft = videoRect.left - margin;
    const videoRight = videoRect.right + margin;
    const videoTop = videoRect.top - margin;
    const videoBottom = videoRect.bottom + margin;
    
    return !(photoRight < videoLeft || left > videoRight || photoBottom < videoTop || top > videoBottom);
}

// Генерация позиции без пересечений
function getNonOverlappingPosition(existingPositions, size = 120) {
    let attempts = 0;
    let valid = false;
    let left, top;
    
    while (!valid && attempts < 300) {
        left = 20 + Math.random() * (window.innerWidth - size - 20);
        top = 80 + Math.random() * (window.innerHeight - size - 80);
        
        valid = true;
        
        if (isOverlappingWithVideo(left, top, size)) {
            valid = false;
        }
        
        for (let pos of existingPositions) {
            if (isOverlapping({ left, top }, pos, size, 135)) {
                valid = false;
                break;
            }
        }
        attempts++;
    }
    
    return { left, top };
}

function getRandomRotation() {
    return -10 + Math.random() * 20;
}

function makeConfetti() {
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ff4500', '#ffd700', '#ff6347', '#ff6b6b', '#ffa500', '#00ff7f', '#00bfff'];
    
    const envelopeRect = document.getElementById('envelope').getBoundingClientRect();
    const centerX = envelopeRect.left + envelopeRect.width / 2;
    const centerY = envelopeRect.top + envelopeRect.height / 2;
    
    for (let i = 0; i < 350; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.width = (6 + Math.random() * 14) + 'px';
        conf.style.height = (6 + Math.random() * 14) + 'px';
        
        conf.style.left = (centerX - 5 + Math.random() * 10) + 'px';
        conf.style.top = (centerY - 5 + Math.random() * 10) + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 400 + Math.random() * 500;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 150;
        
        document.body.appendChild(conf);
        
        conf.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${dx * 0.3}px, ${dy * 0.3}px) rotate(120deg)`, opacity: 1 },
            { transform: `translate(${dx * 0.7}px, ${dy * 0.7}px) rotate(240deg)`, opacity: 0.8 },
            { transform: `translate(${dx}px, ${dy}px) rotate(480deg)`, opacity: 0 }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        setTimeout(() => conf.remove(), 1500);
    }
}

function showMessage() {
    const msg = document.createElement('div');
    msg.className = 'birthday-message';
    msg.innerHTML = '🎂🎈 Happy Birthday, Margoshka! 🎈🎂<br>❤️ Ты самая лучшая! ❤️';
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.opacity = '0';
        msg.style.transition = 'opacity 0.5s';
        setTimeout(() => msg.remove(), 500);
    }, 8000);
}

function showVideoInCenter() {
    const videoContainer = document.getElementById('videoCenter');
    videoContainer.style.display = 'block';
    videoContainer.innerHTML = `
        <video controls autoplay loop playsinline>
            <source src="birthday.mp4" type="video/mp4">
            <p>🎬 Видео не найдено. Проверьте папку video/ и файл birthday.mp4</p>
        </video>
    `;
    const video = videoContainer.querySelector('video');
    video.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
}

function flyPhotosRandomly() {
    const container = document.getElementById('photosContainer');
    container.innerHTML = '';
    container.style.display = 'block';
    
    const envelope = document.getElementById('envelope');
    const envRect = envelope.getBoundingClientRect();
    const startX = envRect.left + envRect.width / 2;
    const startY = envRect.top + envRect.height / 2;
    
    setTimeout(() => {
        const positions = [];
        
        for (let i = 1; i <= 11; i++) {
            const { left, top } = getNonOverlappingPosition(positions, 120);
            positions.push({ left, top });
            
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-card';
            
            const img = document.createElement('img');
            img.src = `pfoto/${i}.jpg`;
            img.alt = `Фото ${i}`;
            
            img.onerror = () => {
                console.log(`Фото ${i}.jpg не найдено в папке pfoto/`);
                img.src = `https://placehold.co/120x120?text=${i}`;
            };
            
            photoDiv.appendChild(img);
            
            const rotation = getRandomRotation();
            
            photoDiv.style.left = left + 'px';
            photoDiv.style.top = top + 'px';
            photoDiv.style.transform = `rotate(${rotation}deg)`;
            photoDiv.style.opacity = '0';
            
            container.appendChild(photoDiv);
            
            setTimeout(() => {
                photoDiv.style.transition = 'opacity 0.4s';
                photoDiv.style.opacity = '1';
            }, i * 60);
        }
    }, 400);
}

function hideEnvelope() {
    const wrapper = document.getElementById('envelopeWrapper');
    wrapper.classList.add('hide');
}

function hideButtonsAndFooter() {
    const buttons = document.getElementById('buttons');
    const footer = document.getElementById('footer');
    
    if (buttons) buttons.classList.add('hide');
    if (footer) footer.classList.add('hide');
}

function openEnvelope() {
    if (isOpened) return;
    
    isOpened = true;
    const envelope = document.getElementById('envelope');
    envelope.classList.add('open');
    
    makeConfetti();
    
    setTimeout(() => {
        hideEnvelope();
    }, 500);
    
    setTimeout(() => {
        showVideoInCenter();
    }, 600);
    
    setTimeout(() => {
        flyPhotosRandomly();
    }, 800);
    
    setTimeout(() => {
        hideButtonsAndFooter();
    }, 400);
    
    setTimeout(() => {
        showMessage();
    }, 1800);
    
    const openBtn = document.getElementById('openBtn');
    if (openBtn) {
        openBtn.textContent = '✨ OPENED ✨';
        openBtn.disabled = true;
    }
}

function showModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

const openBtn = document.getElementById('openBtn');
const dontBtn = document.getElementById('dontBtn');
const modalClose = document.getElementById('modalClose');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

if (openBtn) openBtn.onclick = openEnvelope;
if (dontBtn) {
    dontBtn.onclick = () => {
        if (!isOpened) {
            showModal();
        } else {
            alert('Конверт уже открыт! 🎉');
        }
    };
}

if (modalClose) modalClose.onclick = closeModal;
if (modalConfirmBtn) modalConfirmBtn.onclick = closeModal;

window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};

console.log('✅ Скрипт загружен!');
console.log('📁 Фото: pfoto/1.jpg - 11.jpg');
console.log('📁 Видео: birthday.mp4');
console.log('📁 Грустная картинка: sad.png');
console.log('💚 Фото не касаются друг друга и видео');