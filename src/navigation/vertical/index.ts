// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline',
    },
    {
      title: 'Kullanıcılar',
      path: '/users',
      icon: 'mdi:email-outline',
    },
    {
      title: 'Ürünler',
      path: '/product',
      icon: 'mdi:marketplace-outline',
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Access Control',
      icon: 'mdi:shield-outline',
    },
  ]
}

export default navigation
