// Technical Support Portal App for FSK-Region - ULTRA CLEAN VERSION
class SupportPortalApp {
    constructor() {
        this.systems = [];
        this.filteredSystems = [];
        this.currentSystem = null;
        this.selectedIndex = -1;
        this.systemImages = this.initializeSystemImages();
        this.initializeElements();
        this.loadSystems();
        this.setupEventListeners();
        this.handleRouting();
        this.initTheme(); // Инициализация темы
    }

    initializeSystemImages() {
        return {
            "1С БИТ Финанс": "./images/1c-logo.png",
            "Битрикс24": "./images/bitrix24-logo.png",
            "MS Outlook": "./images/outlook-logo.png",
            "MS Power BI": "./images/powerbi-logo.png",
            "MS Teams": "./images/teams-logo.png",
            "ЯндексТакси": "./images/yandex-taxi-logo.png",
            "B2B Center": "./images/b2b-center-logo.png",
            "iSpring": "./images/ispring-logo.png",
            "Консультант+": "./images/consultant-logo.png",
            "Диадок": "./images/diadoc-logo.png",
            "BuildDocs": "./images/builddocs-logo.png",
            "Albato": "./images/albato-logo.png",
            "Техзор": "./images/tehzor-logo.png",
            "Диадок": "./images/kontur.diadoc-logo.png",
            "Консультант+": "./images/consplus-logo.png",
            "Консультант+Регионы": "./images/consplus-logo.png",
            "Техэксперт": "./images/tehexp-logo.png",
            "ЯндексТакси": "./images/yandex-go-logo.png",
            "B2B Center": "./images/b2b-logo.png",
            "Ispring": "./images/ispring-logo.png",
            "MS Outlook": "./images/outlook-logo.png",
            "MS Power BI": "./images/power-bi-logo.png",
            "Plan-R": "./images/plan-r-logo.png",
            "Sarex": "./images/sarex-logo.png",
            "SmartWay": "./images/smartway-logo.png",
            "StormBPMN": "./images/storm-logo.png",
            "Tangl Control": "./images/tangl-logo.png",
            "Trivio": "./images/trivio-logo.png",
            "VMware Horizon": "./images/horizon-logo.png",
            "ЛИРА-САПФИР": "./images/lira-logo.png",
            "DevIS": "./images/devis-logo.png",
            "HR-Link": "./images/hrlink-logo.png",
            "ИСУП": "./images/forst-logo.png",
            "Контур.Фокус": "./images/focus-logo.png",

        };
    }

    initializeElements() {
        this.searchInput = document.getElementById('system-search');
        this.selectButton = document.getElementById('select-button');
        this.searchDropdown = document.getElementById('search-dropdown');
        this.searchResults = document.getElementById('search-results');
        this.systemsContainer = document.getElementById('systems-container');
        this.mainPage = document.getElementById('main-page');
        this.supportPage = document.getElementById('support-page');
        this.backButton = document.getElementById('back-button');
        this.supportTitle = document.getElementById('support-title');
        this.helpdeskContent = document.getElementById('helpdesk-content');
        this.emailContent = document.getElementById('email-content');
        this.helpdeskLink = document.getElementById('helpdesk-link');
        this.emailLink = document.getElementById('email-link');
        this.systemName1 = document.getElementById('system-name-1');
        this.systemName2 = document.getElementById('system-name-2');
        this.systemNameTemplate = document.getElementById('system-name-template');
        this.composeEmailButton = document.getElementById('compose-email');
        this.themeToggle = document.getElementById('theme-toggle'); // Новая кнопка
        this.themeIcon = this.themeToggle.querySelector('.theme-icon'); // Иконка темы
    }

    async loadSystems() {
        try {
            const response = await fetch('systems_data.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            this.systems = await response.json();
        } catch (error) {
            console.error('Error loading systems data:', error);
            this.systems = [
                { "name": "1С БИТ Финанс ", "support_type": "Техническая поддержка ГК ФСК", "support_method": "email", "support_link": "hd@fsk.ru" },
                { "name": "Битрикс24", "support_type": "Хелпдеск ФСК-Регион", "support_method": "helpdesk", "support_link": "https://example.com" }
            ];
        }
        this.renderSystemsGrid();
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.handleSearch(this.searchInput.value);
            }
        });

        this.selectButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.selectCurrentSystem();
        });

        this.backButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.showMainPage();
        });

        if (this.composeEmailButton) {
            this.composeEmailButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.composeEmail();
            });
        }

        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) &&
                !this.searchDropdown.contains(e.target) &&
                !this.selectButton.contains(e.target)) {
                this.hideDropdown();
            }
        });

        window.addEventListener('hashchange', () => {
            this.handleRouting();
        });

        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    handleSearch(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            this.hideDropdown();
            return;
        }

        this.filteredSystems = this.systems.filter(system =>
            system.name.toLowerCase().includes(trimmedQuery.toLowerCase())
        );

        this.selectedIndex = -1;
        this.renderSearchResults();

        if (this.filteredSystems.length > 0) {
            this.showDropdown();
        } else {
            this.hideDropdown();
        }
    }

    handleKeydown(e) {
        if (!this.searchDropdown.classList.contains('hidden')) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredSystems.length - 1);
                    this.highlightResult();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    this.highlightResult();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectCurrentSystem();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.hideDropdown();
                    break;
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            this.selectCurrentSystem();
        }
    }

    renderSearchResults() {
        this.searchResults.innerHTML = '';

        if (this.filteredSystems.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Системы не найдены';
            li.style.opacity = '0.7';
            li.style.cursor = 'default';
            this.searchResults.appendChild(li);
            return;
        }

        this.filteredSystems.forEach((system, index) => {
            const li = document.createElement('li');
            li.textContent = system.name;
            li.dataset.index = index;

            li.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectSystem(system);
            });

            li.addEventListener('mouseover', () => {
                this.selectedIndex = index;
                this.highlightResult();
            });

            this.searchResults.appendChild(li);
        });
    }

    highlightResult() {
        const results = this.searchResults.querySelectorAll('li');
        results.forEach((result, index) => {
            result.classList.toggle('highlighted', index === this.selectedIndex);
        });
    }

    selectCurrentSystem() {
        if (this.selectedIndex >= 0 && this.filteredSystems[this.selectedIndex]) {
            this.selectSystem(this.filteredSystems[this.selectedIndex]);
            return;
        }

        const query = this.searchInput.value.trim();
        if (!query) return;

        let targetSystem = this.systems.find(system =>
            system.name.toLowerCase() === query.toLowerCase()
        );

        if (!targetSystem) {
            targetSystem = this.systems.find(system =>
                system.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (targetSystem) {
            this.selectSystem(targetSystem);
        }
    }

    selectSystem(system) {
        if (!system) return;

        this.currentSystem = system;
        this.searchInput.value = '';
        this.hideDropdown();
        this.showSupportPage(system);
    }

    showDropdown() {
        this.searchDropdown.classList.remove('hidden');
    }

    hideDropdown() {
        this.searchDropdown.classList.add('hidden');
        this.selectedIndex = -1;
    }

    renderSystemsGrid() {
        if (!this.systemsContainer) return;

        this.systemsContainer.innerHTML = '';

        // Разделяем системы на две группы
        const helpdeskSystems = this.systems
            .filter(system => system.support_method === 'helpdesk')
            .sort((a, b) => a.name.localeCompare(b.name));

        const emailSystems = this.systems
            .filter(system => system.support_method === 'email')
            .sort((a, b) => a.name.localeCompare(b.name));

        // Создаем заголовки для разделов
        const createSectionHeader = (title) => {
            const header = document.createElement('h2');
            header.className = 'systems-section-header';
            header.textContent = title;
            return header;
        };

        // Добавляем раздел Helpdesk
        if (helpdeskSystems.length > 0) {
            this.systemsContainer.appendChild(createSectionHeader('Программное обеспечение ФСК Регион'));
            helpdeskSystems.forEach(system => {
                const card = this.createSystemCard(system);
                this.systemsContainer.appendChild(card);
            });
        }

        // Добавляем раздел Email
        if (emailSystems.length > 0) {
            this.systemsContainer.appendChild(createSectionHeader('Программное обеспечение ГК ФСК'));
            emailSystems.forEach(system => {
                const card = this.createSystemCard(system);
                this.systemsContainer.appendChild(card);
            });
        }
    }

    createSystemCard(system) {
        const card = document.createElement('div');
        card.className = 'system-card';

        // Добавляем класс для систем с темным текстом
        const darkTextSystems = ["Битрикс24", "ЯндексТакси", "B2B Center", 'BuildDocs'];
        if (darkTextSystems.includes(system.name)) {
            card.classList.add('system-card--dark-text');
        }

        card.setAttribute('data-support-type', system.support_method);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Открыть поддержку для системы ${system.name}`);

        // Проверяем есть ли изображение для системы
        const imageUrl = this.systemImages[system.name];

        if (imageUrl) {
            card.style.backgroundImage = `url(${imageUrl})`;
            card.classList.add('system-card--with-image');
        } else {
            // Для систем без изображения создаем цветной фон на основе названия
            const colors = ['#FF6600', '#FFA500', '#E68161', '#CC5200'];
            const colorIndex = system.name.length % colors.length;
            card.style.backgroundColor = colors[colorIndex];
        }

        const nameDiv = document.createElement('h3');
        nameDiv.className = 'system-name';
        nameDiv.textContent = system.name;
        card.appendChild(nameDiv);

        card.addEventListener('click', () => this.selectSystem(system));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.selectSystem(system);
            }
        });

        return card;
    }

    generateSystemIcon(name) {
        if (!name) return '?';

        const words = name.split(' ').filter(word => word.length > 0);

        if (words.length === 1) {
            return name.substring(0, 2).toUpperCase();
        }

        return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
    }

    showSupportPage(system) {
        this.supportTitle.textContent = 'Техническая поддержка - ' + system.name;

        if (system.support_method === 'helpdesk') {
            this.showHelpdeskSupport(system);
        } else {
            this.showEmailSupport(system);
        }

        this.mainPage.classList.add('hidden');
        this.supportPage.classList.remove('hidden');

        window.location.hash = 'system/' + encodeURIComponent(system.name);
    }

    showHelpdeskSupport(system) {
        this.systemName1.textContent = system.name;
        this.helpdeskLink.href = system.support_link;

        this.helpdeskContent.classList.remove('hidden');
        this.emailContent.classList.add('hidden');
    }

    showEmailSupport(system) {
        this.systemName2.textContent = system.name;
        this.systemNameTemplate.textContent = system.name;
        this.emailLink.textContent = system.support_link;

        this.emailContent.classList.remove('hidden');
        this.helpdeskContent.classList.add('hidden');
    }

    composeEmail() {
        if (!this.currentSystem) return;

        const subject = encodeURIComponent('Техподдержка - ' + this.currentSystem.name);
        const email = this.currentSystem.support_link;
        const mailtoLink = 'mailto:' + email + '?subject=' + subject;

        window.location.href = mailtoLink;
    }

    showMainPage() {
        this.supportPage.classList.add('hidden');
        this.mainPage.classList.remove('hidden');
        this.currentSystem = null;

        window.location.hash = '';
    }

    handleRouting() {
        const hash = window.location.hash;

        if (hash.startsWith('#system/')) {
            const systemName = decodeURIComponent(hash.replace('#system/', ''));
            const system = this.systems.find(s => s.name === systemName);

            if (system) {
                this.showSupportPage(system);
            } else {
                this.showMainPage();
            }
        } else {
            this.showMainPage();
        }
    }

    // Новые методы для управления темой
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (prefersDark) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }
    }

    setTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(theme + '-theme');

        // Обновляем иконку
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';

        // Сохраняем в localStorage
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SupportPortalApp();
});
