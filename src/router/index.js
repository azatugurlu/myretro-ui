import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import i18n from '@/lang/index'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/login/register/index'), hidden: true },
  { path: '/register-success', component: () => import('@/views/login/register/register-success'), hidden: true },
  { path: '/password-reset', component: () => import('@/views/login/password-reset/index'), hidden: true },
  { path: '/password-reset-validate', component: () => import('@/views/login/password-reset/validate'), hidden: true },
  { path: '/register-validate', component: () => import('@/views/login/register/validate'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles and permissions
 */
  export const asyncRoutes =[
    {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { 
        title: i18n.t('menu.main'),
        icon: 'dashboard'
      }
    },
    {
      path: 'board-details/:id',
      component: () => import('@/views/board/index'),
      name: 'board-details',
      hidden: true,
      meta: { 
        title: i18n.t('menu.admin.boardDetails')
      }
    }]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/settings/user',
    name: 'Admin',
    meta: {
      title: i18n.t('menu.admin.main'),
      icon: 'nested',
      breadcrumb: false,
      roles: ['can_manage_user', 'can_manage_role']
    },
    children: [
      {
        path: 'user-settings',
        component: () => import('@/views/settings/user/index'), // Parent router-view
        name: 'user-settings',
        meta: { 
          title: i18n.t('menu.admin.userSettings'),
          icon: 'user',
          breadcrumb: false,
          roles: ['can_manage_user']
        },
        children: [
          {
            path: 'user-list',
            component: () => import('@/views/settings/user/list/index'),
            name: 'user-list',
            meta: { 
              title: i18n.t('menu.admin.userList'),
              icon: 'user',
              roles: ['can_manage_user']
            }
          },
          {
            path: 'user-list-details/:id',
            component: () => import('@/views/settings/user/list/list-details'),
            name: 'user-list-details',
            hidden: true,
            meta: { 
              title: i18n.t('menu.admin.userList')+' Details',
              icon: 'user',
              roles: ['can_manage_user']
            }
          }
        ]
      },
      {
        path: 'role-permission-settings',
        component: () => import('@/views/settings/user/index'), // Parent router-view
        name: 'role-permission-settings',
        meta: { 
          title: i18n.t('menu.admin.roleAndPermissions'),
          icon: 'form',
          breadcrumb: false,
          roles: ['can_manage_role', 'can_manage_permission', 'can_assign_permission_to_role']
        },
        children: [
          {
            path: 'teams',
            component: () => import('@/views/settings/user/team/index'),
            name: 'teams',
            meta: { 
              title: i18n.t('menu.admin.teams'),
              icon: 'tree',
              roles: ['can_manage_role']
            }
          },
          {
            path: 'team-users',
            component: () => import('@/views/settings/user/team-users/index'),
            name: 'team-users',
            meta: { 
              title: i18n.t('menu.admin.teamUsers'),
              icon: 'tree',
              roles: ['can_assign_permission_to_role']
            }
          },
          {
            path: 'user-roles',
            component: () => import('@/views/settings/user/role/index'),
            name: 'user-roles',
            meta: { 
              title: i18n.t('menu.admin.roles'),
              icon: 'nested',
              roles: ['can_manage_role']
            }
          },
          {
            path: 'user-permissions',
            component: () => import('@/views/settings/user/permission/index'),
            name: 'user-permissions',
            meta: { 
              title: i18n.t('menu.admin.permissions'),
              icon: 'nested',
              roles: ['can_manage_permission']
            }
          },
          {
            path: 'role-permissions',
            component: () => import('@/views/settings/user/role-permissions/index'),
            name: 'role-permissions',
            meta: { 
              title: i18n.t('menu.admin.rolePermissions'),
              icon: 'nested',
              roles: ['can_assign_permission_to_role']
            }
          }
        ]
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Profile',
        component: () => import('@/views/profile/index'),
        meta: { title: i18n.t('menu.profile'), icon: 'user' }
      }
    ]
  },
  {
    path: '/change-password',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'ChangePassword',
        component: () => import('@/views/changePassword/index'),
        meta: { title: i18n.t('menu.changePassword') }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
