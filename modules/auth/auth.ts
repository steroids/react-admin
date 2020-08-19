import {generateCrud} from '@steroidsjs/core/ui/crud';
import CrudAuthLogins from './CrudAuthLogins';

/**
 * Пример раздела "пользователи" для панели администрирования.
 * Возможности:
 *  - CRUD пользователей
 *  - Блокирование пользователя
 *  - Изменения пароля
 *  - Просмотр истории отправленных кодов подтверждения
 *  - Повторная отправка кода подтверждения
 *  - Ручное подтверждение емаил/телефона
 *  - Просмотр входов пользователя
 *  - Логаут как с конкретных устройств, так и разом со всех
 * Установка:
 * Скопируйте данный файл в проект и настройте необходимые для отображения поля
 */

export default generateCrud('auth', {
    label: __('Пользователи'),
    model: 'app.core.models.User',
    path: '/admin/auth',
    restUrl: '/api/v1/admin/auth',
    models: [
        'steroids.auth.models.AuthLogin',
        'steroids.auth.models.AuthConfirm',
    ],
    grid: {
        columns: [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'language',
            'isBanned',
            'createTime',
            // ...
        ],
    },
    form: {
        fields: [
            'role',
            'email',
            'phone',
            'language',
            // ...
        ],
    },
    detail: {
        attributes: [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'language',
            'isBanned',
            'createTime',
            // ...
        ],
    },
    items: {
        logins: {
            label: __('Настройки доступа'),
            icon: 'key',
            component: CrudAuthLogins,
        },
    }
});
