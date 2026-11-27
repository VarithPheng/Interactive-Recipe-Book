// Page code loaders, shared by the lazy routes in App.tsx and by preloads (e.g. on hover),
// so a preloaded page's code is already downloaded when the route renders it.
export const loadDetailPage = () => import('@/pages/RecipeDetailPage')
export const loadFormPage = () => import('@/pages/RecipeFormPage')
export const loadFavoritesPage = () => import('@/pages/FavoritesPage')
export const loadShoppingListPage = () => import('@/pages/ShoppingListPage')
export const loadAboutPage = () => import('@/pages/AboutPage')
export const loadNotFoundPage = () => import('@/pages/NotFoundPage')
