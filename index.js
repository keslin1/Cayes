// ===============================================================
//  index.js — Les Cayes Dropshipping
//  Tout lojik JavaScript pou paj dakèy (index.html)
// ===============================================================

// ===== KONFIGIRASYON JENERAL =====
const MESSAGE_KEY = 'lcd_user_messages';
let baseLikes = 39;

// ===== SISTÈM LIKE =====
function initLikeSystem() {
    const likeCountElem = document.getElementById('like-count');
    const likeIcon = document.getElementById('like-icon');
    const userHasLiked = localStorage.getItem('user_has_liked') === 'true';

    let current = 1;
    const duration = 1000;
    const interval = duration / baseLikes;

    const counter = setInterval(() => {
        current++;
        let displayTotal = userHasLiked ? (current + 1) : current;
        if (likeCountElem) likeCountElem.textContent = displayTotal;

        if (current >= baseLikes) {
            clearInterval(counter);
            if (userHasLiked && likeIcon) {
                likeIcon.textContent = 'thumb_up';
                likeIcon.style.color = 'var(--kaki)';
            }
        }
    }, interval);
}

window.toggleLike = function() {
    const likeIcon      = document.getElementById('like-icon');
    const likeCountElem = document.getElementById('like-count');
    const sound         = document.getElementById('like-sound');

    let isLiked = localStorage.getItem('user_has_liked') === 'true';

    if (!isLiked) {
        if (sound) { sound.currentTime = 0; sound.play(); }
        if (likeIcon) {
            likeIcon.textContent = 'thumb_up';
            likeIcon.style.color = 'var(--kaki)';
            likeIcon.style.transform = "scale(1.3)";
            setTimeout(() => { likeIcon.style.transform = "scale(1)"; }, 200);
        }
        if (likeCountElem) likeCountElem.textContent = baseLikes + 1;
        localStorage.setItem('user_has_liked', 'true');
    } else {
        if (likeIcon) {
            likeIcon.textContent = 'thumb_up_off_alt';
            likeIcon.style.color = 'var(--bleu-marin)';
        }
        if (likeCountElem) likeCountElem.textContent = baseLikes;
        localStorage.setItem('user_has_liked', 'false');
    }
};

// ===== GESTION DU PROFIL ET DU HEADER =====
function refreshHeader() {
    const profile  = JSON.parse(localStorage.getItem('user_profile_data')) || {};
    const nameElem = document.getElementById('user-display-name');
    const cityElem = document.getElementById('user-display-city');

    if (profile.nom && nameElem) {
        let nomAntye = profile.nom.trim();
        nameElem.textContent = nomAntye.length > 12
            ? nomAntye.substring(0, 10) + "..."
            : nomAntye;
    } else if (nameElem) {
        nameElem.textContent = "Les Cayes Dropshipping";
    }

    if (profile.address && cityElem) {
        let vilNet = profile.address.split(',')[0].trim().split(' ')[0];
        cityElem.textContent = vilNet.length > 10
            ? vilNet.substring(0, 8) + "..."
            : vilNet;
    } else if (cityElem) {
        cityElem.textContent = "Haïti-Sud";
    }
}

// ===== BADGE FOOTER (MESAJ) =====
function updateHomeBadge() {
    const messages   = JSON.parse(localStorage.getItem('lcd_user_messages')) || [];
    const unreadCount = messages.filter(m => !m.read).length;
    const footerBadge = document.getElementById('footer-badge');
    if (footerBadge) {
        footerBadge.style.display  = unreadCount > 0 ? 'block' : 'none';
        footerBadge.textContent    = unreadCount;
    }
}

// ===== BADGE FOOTER (MESAJ) — rafraîchi depuis index.html =====
// Fonksyon sa a li direkteman nan localStorage pou montre badge
// sou bouton "Kont mwen" nan footer a, menm lè itilizatè a sou paj dakèy.
function updateNotifBadges() {
    try {
        const messages    = JSON.parse(localStorage.getItem('lcd_user_messages')) || [];
        const unreadCount = messages.filter(m => !m.read).length;
        const footerBadge = document.getElementById('footer-badge');
        if (footerBadge) {
            if (unreadCount > 0) {
                footerBadge.style.display = 'block';
                footerBadge.textContent   = unreadCount;
            } else {
                footerBadge.style.display = 'none';
                footerBadge.textContent   = '';
            }
        }
    } catch(e) {}
}

// ===== GESTION DES NOTIFICATIONS =====
function requestPermission() {
    console.log("Sistèm nan ap mande pèmisyon...");

    if (!("Notification" in window)) {
        alert("Navigatè sa a pa sipòte notifikasyon.");
        femenModalNotif();
        return;
    }

    if (Notification.permission === 'denied') {
        alert("Ou te bloke notifikasyon yo nan paramèt navigatè w la. Tanpri debloke yo pou Les Cayes Dropshipping ka fonksyone.");
        return;
    }

    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            localStorage.setItem('notif_accepted', 'true');
            femenModalNotif();
            console.log("Otorizasyon aksepte!");
        } else {
            refuseAccess();
        }
    });
}

function refuseAccess() {
    alert("Atansyon! Aplikasyon Les Cayes Dropshipping lan pa ka fonksyone san notifikasyon yo. Sa a nesesè pou sekirite ak swivi koli ou yo.");
}

function femenModalNotif() {
    const modal = document.getElementById('notif-modal');
    if (modal) modal.style.setProperty('display', 'none', 'important');
}

// Rann fonksyon yo piblik pou bouton HTML yo
window.requestPermission = requestPermission;
window.refuseAccess      = refuseAccess;

// ===== ANIMASYON CAROUSEL BANNER (CHAK 10 SEKOND) =====
function initBannerCarousel() {
    const carousel  = document.getElementById('banner-carousel');
    const container = carousel ? carousel.querySelector('.carousel-container') : null;
    if (!carousel || !container) return;

    let scrollAmount = 0;
    const items      = container.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    setInterval(() => {
        const itemWidth = items[0].offsetWidth + 15;
        if (scrollAmount >= (itemWidth * (totalItems - 1))) {
            scrollAmount = 0;
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            scrollAmount += itemWidth;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        }
    }, 10000);
}

// ===== MODALS =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

window.onclick = function(event) {
    if (event.target.className === 'modal') {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

window.openModal  = openModal;
window.closeModal = closeModal;

// ===== SISTÈM AVIS KLIYAN =====

// --- DAT REFERANS ---
// Chak kòmantè gen yon "publishedAt" ki se yon timestamp reyèl (milisegond).
// Chak fwa paj la chaje, fonksyon an kalkile diferans ant kounye a ak dat pibliyasyon an.
// Sa vle di si ou te wè "45 minit" epi ou retounen 10 minit apre, ou pral wè "55 minit".
function getRefDate(daysAgo, minutesAgo) {
    minutesAgo = minutesAgo || 0;
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setMinutes(d.getMinutes() - minutesAgo);
    return d.getTime();
}

// --- FONKSYON: Konvèti timestamp an tèks relatif kreyòl (kalkile an tan reyèl) ---
function formatDateRelative(timestamp) {
    const now        = Date.now();
    const diffMs     = now - timestamp;
    const diffMin    = Math.floor(diffMs / 60000);
    const diffHours  = Math.floor(diffMs / 3600000);
    const diffDays   = Math.floor(diffMs / 86400000);
    const diffWeeks  = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMin < 2)       return "kounye a";
    if (diffMin < 60)      return "sa gen " + diffMin + " minit";
    if (diffHours < 24)    return "sa gen " + diffHours + " è";
    if (diffDays === 1)    return "yè";
    if (diffDays === 2)    return "avan-yè";
    if (diffDays < 7)      return diffDays + " jou pase";
    if (diffWeeks === 1)   return "1 semèn pase";
    if (diffWeeks < 5)     return diffWeeks + " semèn pase";
    if (diffMonths === 1)  return "1 mwa pase";
    if (diffMonths < 12)   return diffMonths + " mwa pase";
    return "plis pase 1 an";
}

// --- DONNEES SIMULATION (publishedAt = dat reyèl kalkile) ---
// Referans: 18 mas 2026
// Valpare B.     → te pibliye 3 jou pase      = 15 mas 2026
// Claire Suze D. → te pibliye yè              = 17 mas 2026
// Steeve P.      → te pibliye 5 jou pase      = 13 mas 2026
// Samuel H.      → te pibliye sa gen 45 minit = jodi a
// Laika V.       → te pibliye 3 semèn pase    = 25 fevriye 2026
// Tania S.       → te pibliye 2 mwa pase      = 18 janvye 2026
// Ricardo J.     → te pibliye avan-yè         = 16 mas 2026
const simulationAvis = [
    {
        id: 101, non: "Valpare B.", stars: 5,
        text: "impotan pou biznis mw, psk ak transpo avyon an m patka rantre kob m envesti yo.",
        publishedAt: getRefDate(3)
    },
    {
        id: 102, non: "Claire Suze D.", stars: 5,
        text: "Pinga mwayen sa vin bay pwob nn mesye Thomas!",
        publishedAt: getRefDate(1)
    },
    {
        id: 103, non: "Steeve P.", stars: 4,
        text: "m swete aprè 4,90 lan pa gen lòt frè, apress bon bgy.",
        publishedAt: getRefDate(5)
    },
    {
        id: 104, non: "Samuel H.", stars: 5,
        text: "Malgre se jan de mwayen transpô mpa f konfyans, men ou konn sa wap f an mister Thomas 👍. Livrezon an yon ti jan long, men nap avanse brother.",
        publishedAt: getRefDate(0, 45) // 45 minit pase depi kounye a
    },
    {
        id: 105, non: "Laika V.", stars: 4,
        text: "Ebyen gen espwa pou store mwen an la 😂🤣.",
        publishedAt: getRefDate(21)
    },
    {
        id: 106, non: "Tania S.", stars: 2,   // ← 2 zetwal
        text: "Pa gen anak, no fake. Se yon sevis ki onèt. Machandiz mw rive an plizye okazyon, men yo rive san manke anyen.",
        publishedAt: getRefDate(59)
    },
    {
        id: 107, non: "Ricardo J.", stars: 1, // ← 1 zetwal
        text: "Mwen fè plizyè kòmand deja. Toujou livre. Reta a se sèl pwoblm, men pou pri a, sekirite; pa gen plenyen.",
        publishedAt: getRefDate(2)
    }
];

// --- FONKSYON: Jenere HTML zetwal (plen, vid, oswa vote interaktif) ---
function buildStars(avisId, currentStars, isInteractive) {
    let html = '<span class="stars-row">';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= currentStars ? 'star' : 'star_border';
        const color  = i <= currentStars ? '#FFD700' : '#ccc';
        if (isInteractive) {
            // Bouton klikab pou vote
            html += `<i class="material-icons star-vote" 
                        style="font-size:18px; color:${color}; cursor:pointer;"
                        onclick="voterAvis(${avisId}, ${i})"
                        onmouseover="hoverStars(${avisId}, ${i})"
                        onmouseout="resetStarHover(${avisId})"
                        data-val="${i}">${filled}</i>`;
        } else {
            html += `<i class="material-icons" style="font-size:14px; color:${color};">${filled}</i>`;
        }
    }
    html += '</span>';
    return html;
}

// --- VOTE: Pèmèt nenpòt itilizatè vote sou yon kòmantè ---
window.voterAvis = function(avisId, nouvoStars) {
    // Sove vòt la nan localStorage
    let votes = JSON.parse(localStorage.getItem('avis_votes')) || {};
    votes[avisId] = nouvoStars;
    localStorage.setItem('avis_votes', JSON.stringify(votes));
    aficheAvis(); // Rafrechi afichaj la
};

// --- EFÈ HOVER SOU ZETWAL YO ---
window.hoverStars = function(avisId, hoverVal) {
    const card = document.getElementById('comment-' + avisId);
    if (!card) return;
    card.querySelectorAll('.star-vote').forEach(star => {
        const val = parseInt(star.getAttribute('data-val'));
        star.textContent = val <= hoverVal ? 'star' : 'star_border';
        star.style.color = val <= hoverVal ? '#FFD700' : '#ccc';
    });
};

window.resetStarHover = function(avisId) {
    const votes = JSON.parse(localStorage.getItem('avis_votes')) || {};
    const stars = votes[avisId] || simulationAvis.find(a => a.id === avisId)?.stars || 0;
    const card  = document.getElementById('comment-' + avisId);
    if (!card) return;
    card.querySelectorAll('.star-vote').forEach(star => {
        const val = parseInt(star.getAttribute('data-val'));
        star.textContent = val <= stars ? 'star' : 'star_border';
        star.style.color = val <= stars ? '#FFD700' : '#ccc';
    });
};

// --- AFICHE TOUT AVIS ---
function aficheAvis() {
    const container = document.getElementById('comments-container');
    if (!container) return;

    let localAvis = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];
    let votes     = JSON.parse(localStorage.getItem('avis_votes')) || {};
    const toutAvis = [...localAvis, ...simulationAvis];

    container.innerHTML = toutAvis.map(a => {
        const isUser       = localAvis.some(la => la.id === a.id);
        // Si itilizatè a te vote sou kòmantè sa, nou montre vòt li a
        const starsAffiche = votes[a.id] !== undefined ? votes[a.id] : (a.stars || 0);
        // Dat: si se yon kòmantè itilizatè (publishedAt timestamp), nou kalkile l dinamikman
        const dateAffiche  = a.publishedAt
            ? formatDateRelative(a.publishedAt)
            : formatDateRelative(a.id); // pou nouvo kòmantè itilizatè (id = Date.now())

        // Tout kòmantè ka resevwa vòt (menm kòmantè simulasyon yo)
        const starsHTML = buildStars(a.id, starsAffiche, true);

        return `
        <div class="comment-card" id="comment-${a.id}">
            <div class="comment-author">
                ${a.non}
                ${starsHTML}
            </div>
            <p class="comment-text" id="text-${a.id}">${a.text}</p>
            <div class="comment-footer" style="display:flex; justify-content:space-between; align-items:center;">
                <span class="comment-date">${dateAffiche}</span>
                ${isUser ? `
                    <div class="user-actions">
                        <button onclick="prepareEdit(${a.id})">Modifye</button>
                        <button onclick="effacerAvis(${a.id})" style="color:red">Efase</button>
                    </div>
                ` : ''}
            </div>
        </div>`;
    }).join('');
}

window.ajouterAvis = function() {
    const textInput = document.getElementById('user-comment');
    const text      = textInput.value;
    const editId    = textInput.getAttribute('data-edit-id');
    if (text.trim() === "") return;

    const profile  = JSON.parse(localStorage.getItem('user_profile_data')) || {};
    const userName = profile.fullname || "Oumenm";
    let localAvis  = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];

    if (editId) {
        localAvis = localAvis.map(a => a.id == editId ? {...a, text: text} : a);
        textInput.removeAttribute('data-edit-id');
    } else {
        localAvis.unshift({
            id:          Date.now(), // sèvi tou kòm timestamp pou dat dinamik
            non:         userName,
            text:        text,
            stars:       0,
            publishedAt: Date.now()  // dat reyèl pibliyasyon an
        });
    }

    localStorage.setItem('user_simulated_avis', JSON.stringify(localAvis));
    textInput.value = "";
    aficheAvis();
};

window.prepareEdit = function(id) {
    let localAvis = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];
    const avis    = localAvis.find(a => a.id == id);
    if (avis) {
        const input = document.getElementById('user-comment');
        input.value = avis.text;
        input.setAttribute('data-edit-id', id);
        input.focus();
    }
};

window.effacerAvis = function(id) {
    if (confirm("Èske ou vle efase kòmantè sa a?")) {
        let localAvis = JSON.parse(localStorage.getItem('user_simulated_avis')) || [];
        localAvis     = localAvis.filter(a => a.id != id);
        localStorage.setItem('user_simulated_avis', JSON.stringify(localAvis));
        aficheAvis();
    }
};

// ===== INICIALIZASYON JENERAL LÈ PAJ LA CHAJE =====
document.addEventListener('DOMContentLoaded', () => {
// Kache badge NEW si moun nan te deja vizite transaction.html
var newBadge = document.getElementById('new-badge');
if (newBadge && localStorage.getItem('transaction_visited') === 'true') {
    newBadge.style.display = 'none';
}
var newBadge = document.getElementById('new-badge');
if (newBadge && localStorage.getItem('transaction_visited') === 'true') {
    newBadge.style.display = 'none';
}    
    // 1. Kache splash screen apre 1.5 sekonn
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
    }, 1500);

    // 2. Sistèm Like
    initLikeSystem();

    // 3. Header (non ak vil)
    refreshHeader();

    // 4. Badge mesaj
    updateNotifBadges();

    // 5. Avis kliyan
    aficheAvis();

    // 6. Carousel
    initBannerCarousel();

    // 7. Modal notifikasyon
    const dejaAksepteMemwa = localStorage.getItem('notif_accepted');
    const pèmisyonSistèm   = Notification.permission;

    if (pèmisyonSistèm === 'granted' || dejaAksepteMemwa === 'true') {
        femenModalNotif();
    } else {
        const modal = document.getElementById('notif-modal');
        if (modal) modal.style.display = 'flex';
    }
});