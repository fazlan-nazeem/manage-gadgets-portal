import { v4 as uuid } from 'uuid';

export default [
  {
    id: uuid(),
    category: 'Laptop',
    description: 'Fan broken',
    avatarUrl: '/static/images/avatars/avatar_3.png',
    createdAt: 1555016400000,
    email: 'ekaterina.tankova@devias.io',
    name: 'Ekaterina Tankova',
    phone: '304-428-3097',
    status: 'in-progress'
  },
  {
    id: uuid(),
    category: 'Laptop',
    description: 'mic not working',
    avatarUrl: '/static/images/avatars/avatar_4.png',
    createdAt: 1555016400000,
    email: 'cao.yu@devias.io',
    name: 'Cao Yu',
    phone: '712-351-5711',
    status: 'pending'
  },
  {
    id: uuid(),
    category: 'Laptop',
    description: 'Display issue',
    avatarUrl: '/static/images/avatars/avatar_2.png',
    createdAt: 1555016400000,
    email: 'alexa.richardson@devias.io',
    name: 'Alexa Richardson',
    phone: '770-635-2682',
    status: 'pending'
  },
  {
    id: uuid(),
    category: 'Mobile',
    description: 'Display issue',
    avatarUrl: '/static/images/avatars/avatar_5.png',
    createdAt: 1554930000000,
    email: 'anje.keizer@devias.io',
    name: 'Anje Keizer',
    phone: '908-691-3242',
    status: 'pending'
  },
  {
    id: uuid(),
    category: 'Monitor',
    description: 'Display issue',
    avatarUrl: '/static/images/avatars/avatar_6.png',
    createdAt: 1554757200000,
    email: 'clarke.gillebert@devias.io',
    name: 'Clarke Gillebert',
    phone: '972-333-4106',
    status: 'completed'
  }
];
