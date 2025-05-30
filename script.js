document.addEventListener('DOMContentLoaded', function() {
    // Подсветка активного пункта меню (исправлено сравнение URL)
    const navItems = document.querySelectorAll('.nav-item');
    const currentPath = window.location.pathname;
        const itemHref = item.getAttribute('href');
        const itemPath = new URL(itemHref, window.location.origin).pathname;
        
        if (currentPath.endsWith(itemPath)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Анимация карточек при загрузке
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Обработка точек на карте
    const locationData = {
        downtown: {
            title: "Даунтаун Лос-Сантоса",
            description: "Деловой центр города с небоскребами и офисными зданиями."
        },
        vinewood: {
            title: "Вайнвуд",
            description: "Район, похожий на Голливуд, с знаками на холмах и домами знаменитостей."
        },
        airport: {
            title: "Аэропорт Лос-Сантоса",
            description: "Международный аэропорт с взлетно-посадочными полосами и ангарами."
        }
    };

    // Создаем элемент для подсказки
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    document.body.appendChild(tooltip);

    // Обработчики событий для точек
    document.querySelectorAll('.map-point').forEach(point => {
        let timeoutId;
        
        // Показ подсказки
        const showTooltip = (e) => {
            const location = point.dataset.location;
            const data = locationData[location];
            
            if (!data) return;
            
            const rect = point.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            tooltip.innerHTML = `
                <h4>${data.title}</h4>
                <p>${data.description}</p>
            `;
            
            // Позиционирование
            const x = rect.left + window.scrollX;
            const y = rect.top + window.scrollY;
            
            tooltip.style.left = `${x + rect.width/2 + 15}px`;
            tooltip.style.top = `${y + rect.height/2}px`;
            tooltip.classList.add('active');
        };

        // Скрытие подсказки
        const hideTooltip = () => {
            tooltip.classList.remove('active');
        };

        // ПК-версия
        point.addEventListener('mouseenter', showTooltip);
        point.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 15}px`;
            tooltip.style.top = `${e.pageY + 15}px`;
        });
        point.addEventListener('mouseleave', hideTooltip);

        // Мобильная версия
        point.addEventListener('touchstart', (e) => {
            e.preventDefault();
            timeoutId = setTimeout(() => showTooltip(e), 300);
        });
        
        point.addEventListener('touchend', () => {
            clearTimeout(timeoutId);
            hideTooltip();
        });
    });


    // Плавная прокрутка для якорей (исправлен targetElement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 20;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Общая функция для управления вкладками
    function handleTabs(tabButtonsSelector, contentSelector) {
        const tabBtns = document.querySelectorAll(tabButtonsSelector);
        const tabContents = document.querySelectorAll(contentSelector);

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Удаляем активный класс у всех элементов
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Добавляем активный класс
                btn.classList.add('active');
                const tabId = btn.dataset.tab || btn.dataset.business;
                const content = document.getElementById(tabId);
                
                if (content) content.classList.add('active');
            });
        });
    }

    // Обработчики для различных типов вкладок
    if (document.querySelector('.character-tabs')) handleTabs('.tab-btn', '.tab-content');
    if (document.querySelector('.guide-tabs')) handleTabs('.guide-tab-btn', '.guide-tab-content');
    if (document.querySelector('.business-tabs')) handleTabs('.business-tab', '.business-content');

    // Общая функция для фильтрации
    function handleFilters(buttonsSelector, itemsSelector, filterAttribute) {
        const filterBtns = document.querySelectorAll(buttonsSelector);
        const items = document.querySelectorAll(itemsSelector);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.dataset.filter || btn.dataset.platform;
                
                items.forEach(item => {
                    const itemFilters = item.dataset[filterAttribute].split(',');
                    const shouldShow = filterValue === 'all' || itemFilters.includes(filterValue);
                    item.style.display = shouldShow ? '' : 'none';
                });
            });
        });
    }

    // Фильтрация транспорта и читов
    if (document.querySelector('.filter-buttons')) handleFilters('.filter-btn', '.table tbody tr', 'filter');
    if (document.querySelector('.platform-filter')) handleFilters('.platform-filter .filter-btn', '.cheat-row', 'platform');

    // Обработка точек на карте (добавлена проверка существования элемента)
    const locationDetails = document.getElementById('location-details');
    if (locationDetails) {
        const mapPoints = document.querySelectorAll('.map-point');
        const locationData = {
            downtown: {
                title: "Даунтаун Лос-Сантоса",
                description: "Деловой центр города с небоскребами и офисными зданиями."
            },
            vinewood: {
                title: "Вайнвуд",
                description: "Район, похожий на Голливуд, с знаками на холмах и домами знаменитостей."
            },
            airport: {
                title: "Аэропорт Лос-Сантоса",
                description: "Международный аэропорт с взлетно-посадочными полосами и ангарами."
            }
        };

        mapPoints.forEach(point => {
            point.addEventListener('click', () => {
                const location = point.dataset.location;
                const data = locationData[location];
                
                if (data) {
                    locationDetails.innerHTML = `
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <a href="#" class="btn btn-small">Подробнее о локации</a>
                    `;
                }
            });
        });
    }

    // Обработчики для модов (добавлена проверка существования элементов)
    const modSortSelect = document.getElementById('mod-sort');
    const modVersionSelect = document.getElementById('mod-game-version');
    
    if (modSortSelect && modVersionSelect) {
        [modSortSelect, modVersionSelect].forEach(select => {
            select.addEventListener('change', () => {
                console.log('Сортировка изменена:', modSortSelect.value);
                console.log('Версия игры:', modVersionSelect.value);
            });
        });

        document.querySelectorAll('.mod-actions .btn:first-child').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modTitle = btn.closest('.mod-card')?.querySelector('.mod-title')?.textContent;
                if (modTitle) alert(`Начато скачивание мода: ${modTitle}`);
            });
        });
    }

    // Обработка видео (добавлена проверка)
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Видео откроется в новом окне.');
        });
    });

    // Имитация загрузки рейтинга
    if (document.querySelector('.leaderboard')) {
        console.log('Загрузка данных рейтинга...');
    }
