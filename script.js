let isOpened = false;

// Получаем размер фото
function getPhotoSize() {
    if (window.innerWidth >= 1024) return 110;
    if (window.innerWidth >= 768) return 90;
    return 80;
}

// Получаем размер сердца
function getHeartSize() {
    if (window.innerWidth >= 1024) return 45;
    if (window.innerWidth >= 768) return 38;
    return 32;
}

// Получаем минимальное расстояние между объектами
function getMinDistance(photoSize, heartSize) {
    return Math.min(photoSize, heartSize) + 20;
}

// Проверка пересечения двух объектов
function isOverlapping(pos1, pos2, minDist) {
    const dx = pos1.left - pos2.left;
    const dy = pos1.top - pos2.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDist;
}

// Проверка пересечения с видео
function isOverlappingWithVideo(left, top, size, type = 'photo') {
    const videoElem = document.getElementById('videoCenter');
    if (!videoElem || videoElem.style.display === 'none') return false;
    
    const videoRect = videoElem.getBoundingClientRect();
    const margin = (type === 'photo') ? 25 : 15;
    
    const objRight = left + size;
    const objBottom = top + size;
    const videoLeft = videoRect.left - margin;
    const videoRight = videoRect.right + margin;
    const videoTop = videoRect.top - margin;
    const videoBottom = videoRect.bottom + margin;
    
    return !(objRight < videoLeft || left > videoRight || objBottom < videoTop || top > videoBottom);
}

// Проверка выхода за границы экрана
function isWithinBounds(left, top, size) {
    const margin = 10;
    return left >= margin && 
           top >= margin && 
           left + size <= window.innerWidth - margin && 
           top + size <= window.innerHeight - margin;
}

// Генерация позиции для объекта
function getNonOverlappingPosition(existingPositions, objectSize, existingObjects, type = 'photo', maxAttempts = 200) {
    let attempts = 0;
    let left, top;
    
    while (attempts < maxAttempts) {
        left = 15 + Math.random() * (window.innerWidth - objectSize - 30);
        top = 60 + Math.random() * (window.innerHeight - objectSize - 100);
        
        let valid = true;
        
        if (!isWithinBounds(left, top, objectSize)) {
            valid = false;
        }
        
        if (isOverlappingWithVideo(left, top, objectSize, type)) {
            valid = false;
        }
        
        for (let pos of existingPositions) {
            const minDist = getMinDistance(objectSize, objectSize);
            if (isOverlapping({ left, top }, pos, minDist)) {
                valid = false;
                break;
            }
        }
        
        if (valid) {
            return { left, top };
        }
        attempts++;
    }
    
    return { left: 30 + Math.random() * (window.innerWidth - objectSize - 60), 
             top: 70 + Math.random() * (window.innerHeight - objectSize - 100) };
}

function getRandomRotation() {
    return -12 + Math.random() * 24;
}

function makeConfetti() {
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ff4500', '#ffd700', '#ff6347', '#ff6b6b', '#ffa500', '#ff85b3', '#ff4d6d'];
    
    const envelopeRect = document.getElementById('envelope').getBoundingClientRect();
    const centerX = envelopeRect.left + envelopeRect.width / 2;
    const centerY = envelopeRect.top + envelopeRect.height / 2;
    
    const count = window.innerWidth < 768 ? 120 : 250;
    
    for (let i = 0; i < count; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.width = (5 + Math.random() * 12) + 'px';
        conf.style.height = (5 + Math.random() * 12) + 'px';
        
        conf.style.left = (centerX - 5 + Math.random() * 10) + 'px';
        conf.style.top = (centerY - 5 + Math.random() * 10) + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 250 + Math.random() * 400;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 80;
        
        document.body.appendChild(conf);
        
        conf.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${dx * 0.3}px, ${dy * 0.3}px) rotate(120deg)`, opacity: 1 },
            { transform: `translate(${dx * 0.7}px, ${dy * 0.7}px) rotate(240deg)`, opacity: 0.8 },
            { transform: `translate(${dx}px, ${dy}px) rotate(480deg)`, opacity: 0 }
        ], {
            duration: 1400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });
        
        setTimeout(() => conf.remove(), 1400);
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
            <p>🎬 Видео не найдено</p>
        </video>
    `;
    const video = videoContainer.querySelector('video');
    video.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
}

function createHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    heartsContainer.innerHTML = '';
    
    const heartSize = getHeartSize();
    const photoSize = getPhotoSize();
    
    // Собираем существующие позиции фото
    const existingPhotos = [];
    const photoElements = document.querySelectorAll('.photo-card');
    photoElements.forEach(photo => {
        const left = parseFloat(photo.style.left);
        const top = parseFloat(photo.style.top);
        if (!isNaN(left) && !isNaN(top)) {
            existingPhotos.push({ left, top });
        }
    });
    
    // Добавляем позицию видео как препятствие
    const videoElem = document.getElementById('videoCenter');
    let videoPos = null;
    if (videoElem && videoElem.style.display !== 'none') {
        const videoRect = videoElem.getBoundingClientRect();
        videoPos = { left: videoRect.left, top: videoRect.top, width: videoRect.width, height: videoRect.height };
    }
    
    const heartCount = window.innerWidth < 768 ? 18 : 28;
    const heartPositions = [];
    
    for (let i = 0; i < heartCount; i++) {
        let attempts = 0;
        let left, top;
        let placed = false;
        
        while (attempts < 100 && !placed) {
            left = 10 + Math.random() * (window.innerWidth - heartSize - 20);
            top = 10 + Math.random() * (window.innerHeight - heartSize - 20);
            
            let valid = true;
            
            // Проверка с фото
            for (let photo of existingPhotos) {
                const minDist = heartSize + photoSize/2 + 15;
                const dx = (left + heartSize/2) - (photo.left + photoSize/2);
                const dy = (top + heartSize/2) - (photo.top + photoSize/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < minDist) {
                    valid = false;
                    break;
                }
            }
            
            // Проверка с видео
            if (videoPos) {
                const margin = 20;
                const heartRight = left + heartSize;
                const heartBottom = top + heartSize;
                const videoLeft = videoPos.left - margin;
                const videoRight = videoPos.left + videoPos.width + margin;
                const videoTop = videoPos.top - margin;
                const videoBottom = videoPos.top + videoPos.height + margin;
                
                if (!(heartRight < videoLeft || left > videoRight || heartBottom < videoTop || top > videoBottom)) {
                    valid = false;
                }
            }
            
            // Проверка с другими сердечками
            for (let heart of heartPositions) {
                const minDist = heartSize + 8;
                const dx = (left + heartSize/2) - (heart.left + heartSize/2);
                const dy = (top + heartSize/2) - (heart.top + heartSize/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < minDist) {
                    valid = false;
                    break;
                }
            }
            
            if (valid) {
                placed = true;
                heartPositions.push({ left, top });
                
                const heartDiv = document.createElement('div');
                heartDiv.className = 'heart-item';
                heartDiv.innerHTML = '💗';
                heartDiv.style.left = left + 'px';
                heartDiv.style.top = top + 'px';
                heartDiv.style.width = heartSize + 'px';
                heartDiv.style.height = heartSize + 'px';
                heartDiv.style.fontSize = heartSize + 'px';
                heartDiv.style.display = 'flex';
                heartDiv.style.alignItems = 'center';
                heartDiv.style.justifyContent = 'center';
                
                heartsContainer.appendChild(heartDiv);
            }
            attempts++;
        }
    }
}

function flyPhotosRandomly() {
    const container = document.getElementById('photosContainer');
    container.innerHTML = '';
    container.style.display = 'block';
    
    const photoSize = getPhotoSize();
    const positions = [];
    
    for (let i = 1; i <= 11; i++) {
        const { left, top } = getNonOverlappingPosition(positions, photoSize, [], 'photo');
        positions.push({ left, top });
        
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-card';
        
        const img = document.createElement('img');
        img.src = `pfoto/${i}.jpg`;
        img.alt = `Фото ${i}`;
        
        img.onerror = () => {
            img.src = `https://placehold.co/${photoSize}x${photoSize}?text=${i}`;
        };
        
        photoDiv.appendChild(img);
        
        const rotation = getRandomRotation();
        
        photoDiv.style.width = photoSize + 'px';
        photoDiv.style.height = photoSize + 'px';
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
    
    // Добавляем сердечки после появления фото
    setTimeout(() => {
        createHearts();
    }, 800);
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
    
    setTimeout(() => hideEnvelope(), 500);
    setTimeout(() => showVideoInCenter(), 600);
    setTimeout(() => flyPhotosRandomly(), 800);
    setTimeout(() => hideButtonsAndFooter(), 400);
    setTimeout(() => showMessage(), 1800);
    
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

// Обработчики
const openBtn = document.getElementById('openBtn');
const dontBtn = document.getElementById('dontBtn');
const modalClose = document.getElementById('modalClose');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

if (openBtn) openBtn.onclick = openEnvelope;
if (dontBtn) {
    dontBtn.onclick = () => {
        if (!isOpened) showModal();
        else alert('Конверт уже открыт! 🎉');
    };
}
if (modalClose) modalClose.onclick = closeModal;
if (modalConfirmBtn) modalConfirmBtn.onclick = closeModal;

window.onclick = (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
};

// При повороте телефона пересчитываем позиции
let resizeTimer;
window.addEventListener('resize', () => {
    if (isOpened) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            flyPhotosRandomly();
        }, 300);
    }
});

console.log('✅ Скрипт загружен!');
console.log('📁 Фото: pfoto/1.jpg - 11.jpg');
console.log('📁 Видео: birthday.mp4');
console.log('💗 Добавлены розовые сердечки, которые не касаются фото');