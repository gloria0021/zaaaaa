/**
 * デジタル名刺 - メインスクリプト
 * プロフィールデータの表示、vCard生成、インタラクションを管理します。
 */

// ⚠️ profileData は profile.js からグローバル変数として読み込まれます。

const BusinessCardApp = {
    /**
     * 初期化処理
     */
    init() {
        this.fullName = `${profileData.name.last} ${profileData.name.first}`;

        this.render();
        this.initEventListeners();
        this.initResizeObserver();
        this.adjustLayout();

        this.logWelcomeMessage();
    },

    /**
     * データのレンダリング
     */
    render() {
        this.renderBasicInfo();
        this.renderContactInfo();
        this.renderSocialLinks();
        this.renderCertifications();
        this.renderBio();
        this.updateMetaData();
    },

    /**
     * 基本情報の表示
     */
    renderBasicInfo() {
        const { photo, company, post } = profileData;

        const coverPhoto = document.getElementById('cover-photo');
        if (coverPhoto && photo) coverPhoto.src = photo;

        document.getElementById('profile-name').textContent = this.fullName;
        document.getElementById('profile-title').textContent = post;
        document.getElementById('profile-company').textContent = company;
    },

    /**
     * 連絡先情報の表示
     */
    renderContactInfo() {
        const { email, phone, website, address } = profileData;

        // メール
        const emailLink = document.getElementById('contact-email');
        if (emailLink) {
            emailLink.href = `mailto:${email}`;
            this.setTextContentBySelector(emailLink, '.contact-value', email);
        }

        // 電話
        const phoneLink = document.getElementById('contact-phone');
        if (phoneLink) {
            phoneLink.href = `tel:${phone.replace(/-/g, '')}`;
            this.setTextContentBySelector(phoneLink, '.contact-value', phone.replace('+81-', ''));
        }

        // 住所 (Google Map検索リンク)
        const addressLink = document.getElementById('contact-address');
        if (addressLink) {
            const encodedAddress = encodeURIComponent(address.full);
            addressLink.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            this.setTextContentBySelector(addressLink, '.contact-value', address.full);
        }

        // Webサイト
        const websiteLink = document.getElementById('contact-website');
        if (websiteLink && website) {
            websiteLink.href = website;
            this.setTextContentBySelector(websiteLink, '.contact-value', website.replace(/^https?:\/\//, ''));
        }
    },

    /**
     * SNSリンクの表示
     */
    renderSocialLinks() {
        const { social } = profileData;

        const fbLink = document.getElementById('social-facebook');
        if (fbLink && social.facebook) fbLink.href = social.facebook;

        const igLink = document.getElementById('social-instagram');
        if (igLink && social.instagram) igLink.href = social.instagram;
    },

    /**
     * 資格・認定の表示
     */
    renderCertifications() {
        const { certifications } = profileData;
        const list = document.getElementById('certification-list');
        if (!list) return;

        list.innerHTML = certifications.map(cert => `
            <li>
                ${cert.name}
            </li>
        `).join('');
    },

    /**
     * 自己紹介の表示
     */
    renderBio() {
        const { bio } = profileData;
        const bioContent = document.getElementById('bio-content');
        if (bioContent && bio) {
            bioContent.innerHTML = bio.replace(/\n/g, '<br>');
        }
    },

    /**
     * メタデータ（タイトル、コピーライト等）の更新
     */
    updateMetaData() {
        const { company, email } = profileData;

        document.title = `${this.fullName}のデジタル名刺`;

        // メール送信FAB
        const fabMail = document.getElementById('fab-mail');
        if (fabMail) {
            const subject = encodeURIComponent(`${company} ${this.fullName}さんのデジタル名刺`);
            const body = encodeURIComponent(window.location.href);
            fabMail.href = `mailto:${email}?subject=${subject}&body=${body}`;
        }

        // コピーライト
        const footerCopy = document.getElementById('footer-copy');
        if (footerCopy) {
            const year = new Date().getFullYear();
            footerCopy.textContent = `© ${year} ${this.fullName}のデジタル名刺`;
        }
    },

    /**
     * イベントリスナーの登録
     */
    initEventListeners() {
        // 保存ボタン等は現状なし、必要に応じて追加

        // ホバーエフェクト（マウストラッキング）
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            });
        });

        // ウィンドウリサイズ
        window.addEventListener('resize', () => this.adjustLayout());
    },

    /**
     * レイアウトの動的調整
     */
    adjustLayout() {
        const header = document.querySelector('.profile-header');
        const container = document.querySelector('.container');
        const fabContainer = document.querySelector('.fab-container');
        const coverPhoto = document.getElementById('cover-photo');

        if (header && container) {
            container.style.paddingTop = `${header.offsetHeight + 48}px`; // さらに余裕を持たせた余白(48px)
        }

        if (coverPhoto && fabContainer) {
            fabContainer.style.top = `${coverPhoto.offsetHeight}px`;
        }
    },

    /**
     * ヘッダーのリサイズ監視
     */
    initResizeObserver() {
        const header = document.querySelector('.profile-header');
        if (header) {
            const observer = new ResizeObserver(() => this.adjustLayout());
            observer.observe(header);
        }
    },

    /**
     * ユーティリティ: セレクタで子要素のテキストを設定
     */
    setTextContentBySelector(parent, selector, content) {
        const el = parent.querySelector(selector);
        if (el) el.textContent = content;
    },

    /**
     * ウェルカムメッセージ表示
     */
    logWelcomeMessage() {
        console.log('%c🎴 デジタル名刺 %c Refactored with AntiGravity',
            'background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
            'background: #1a1a2e; color: #667eea; padding: 8px 12px; border-radius: 0 4px 4px 0;'
        );
    }
};

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => BusinessCardApp.init());
