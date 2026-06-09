let isOpened = false;

// Получаем размер фото
function getPhotoSize() {
    if (window.innerWidth >= 1024) return 110;
    if (window.innerWidth >= 768) return 90;
    return 75; // для телефона
}

// Получаем минимальное расстояние между фото (чтобы не касались)
function getMinDistance() {
    const size = getPhotoSize();
    return size + 20; // +20px отступа между фото
}

// Проверка пересечения двух фото
function isOverlapping(pos1, pos2, minDist) {
    const dx = pos1.left - pos2.left;
    const dy = pos1.top - pos2.top;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDist;
}

// Проверка пересечения с видео
function isOverlappingWithVideo(left, top, size) {
    const videoElem = document.getElementById('videoCenter');
    if (!videoElem || videoElem.style.display === 'none') return false;
    
    const videoRect = videoElem.getBoundingClientRect();
    const margin = 25; // отступ от видео
    
    const photoRight = left + size;
    const photoBottom = top + size;
    const videoLeft = videoRect.left - margin;
    const videoRight = videoRect.right + margin;
    const videoTop = videoRect.top - margin;
    const videoBottom = videoRect.bottom + margin;
    
    return !(photoRight < videoLeft || left > videoRight || photoBottom < videoTop || top > videoBottom);
}

// Проверка выхода за границы экрана
function isWithinBounds(left, top, size) {
    const margin = 10;
    return left >= margin && 
           top >= margin && 
           left + size <= window.innerWidth - margin && 
           top + size <= window.innerHeight - margin;
}

// Проверка, что фото не слишком близко к краю (для красоты)
function isTooCloseToEdge(left, top, size) {
    const edgeMargin = 15;
    return left < edgeMargin || 
           top < edgeMargin || 
           left + size > window.innerWidth - edgeMargin || 
           top + size > window.innerHeight - edgeMargin;
}

// Генерация позиции без пересечений
function getNonOverlappingPosition(existingPositions, photoSize, maxAttempts = 300) {
    const minDist = getMinDistance();
    let attempts = 0;
    let left, top;
    
    while (attempts < maxAttempts) {
        left = 15 + Math.random() * (window.innerWidth - photoSize - 30);
        top = 60 + Math.random() * (window.innerHeight - photoSize - 80);
        
        let valid = true;
        
        // Проверка выхода за границы
        if (!isWithinBounds(left, top, photoSize)) {
            valid = false;
        }
        
        // Проверка близости к краю (для красоты, не строго)
        if (isTooCloseToEdge(left, top, photoSize) && attempts < 200) {
            valid = false;
        }
        
        // Проверка пересечения с видео
        if (isOverlappingWithVideo(left, top, photoSize)) {
            valid = false;
        }
        
        // Проверка пересечения с другими фото
        for (let pos of existingPositions) {
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
    
    // Если не нашли идеальное место, пробуем с меньшими требованиями
    attempts = 0;
    while (attempts < 100) {
        left = 10 + Math.random() * (window.innerWidth - photoSize - 20);
        top = 50 + Math.random() * (window.innerHeight - photoSize - 70);
        
        let valid = true;
        
        if (isOverlappingWithVideo(left, top, photoSize)) {
            valid = false;
        }
        
        for (let pos of existingPositions) {
            if (isOverlapping({ left, top }, pos, minDist - 10)) {
                valid = false;
                break;
            }
        }
        
        if (valid) {
            return { left, top };
        }
        attempts++;
    }
    
    // Самый последний вариант
    return { left: 50 + Math.random() * (window.innerWidth - photoSize - 100), 
             top: 80 + Math.random() * (window.innerHeight - photoSize - 120) };
}

function getRandomRotation() {
    return -12 + Math.random() * 24;
}

function makeConfetti() {
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ff4500', '#ffd700', '#ff6347', '#ff6b6b', '#ffa500', '#00ff7f', '#00bfff'];
    
    const envelopeRect = document.getElementById('envelope').getBoundingClientRect();
    const centerX = envelopeRect.left + envelopeRect.width / 2;
    const centerY = envelopeRect.top + envelopeRect.height / 2;
    
    const count = window.innerWidth < 768 ? 120 : 280;
    
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

function flyPhotosRandomly() {
    const container = document.getElementById('photosContainer');
    container.innerHTML = '';
    container.style.display = 'block';
    
    const photoSize = getPhotoSize();
    const positions = [];
    
    console.log(`Размещаем 11 фото размером ${photoSize}px на экране ${window.innerWidth}x${window.innerHeight}`);
    
    for (let i = 1; i <= 11; i++) {
        const { left, top } = getNonOverlappingPosition(positions, photoSize);
        positions.push({ left, top });
        
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-card';
        
        const img = document.createElement('img');
        img.src = `pfoto/${i}.jpg`;
        img.alt = `Фото ${i}`;
        
        img.onerror = () => {
            console.log(`Фото ${i}.jpg не найдено`);
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
    setTimeout(() => showMessage(), 1600);
    
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
            console.log('Экран изменён, пересчитываем позиции фото');
            flyPhotosRandomly();
        }, 300);
    }
});

console.log('✅ Скрипт загружен!');
console.log('📁 Фото: pfoto/1.jpg - 11.jpg (11 штук)');
console.log('📁 Видео: birthday.mp4');
console.log('📱 На телефоне фото не касаются друг друга и видео');