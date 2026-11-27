// Route table. All pages render inside Layout (navbar + <Outlet/>).
// Browse loads with the app; other pages are split into their own chunks and loaded on first visit,
// showing a skeleton of the same layout while their code downloads.
import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import {
  AboutSkeleton,
  DetailSkeleton,
  FavoritesSkeleton,
  FormSkeleton,
  ShoppingListSkeleton,
} from '@/components/recipe/Skeletons'
import {
  loadAboutPage,
  loadDetailPage,
  loadFavoritesPage,
  loadFormPage,
  loadNotFoundPage,
  loadShoppingListPage,
} from '@/lib/pages'
import { BrowsePage } from '@/pages/BrowsePage'

const RecipeDetailPage = lazy(() => loadDetailPage().then((m) => ({ default: m.RecipeDetailPage })))
const RecipeFormPage = lazy(() => loadFormPage().then((m) => ({ default: m.RecipeFormPage })))
const FavoritesPage = lazy(() => loadFavoritesPage().then((m) => ({ default: m.FavoritesPage })))
const ShoppingListPage = lazy(() => loadShoppingListPage().then((m) => ({ default: m.ShoppingListPage })))
const AboutPage = lazy(() => loadAboutPage().then((m) => ({ default: m.AboutPage })))
const NotFoundPage = lazy(() => loadNotFoundPage().then((m) => ({ default: m.NotFoundPage })))

function Lazy({ fallback, children }: { fallback: ReactNode; children: ReactNode }) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BrowsePage />} />
        <Route
          path="recipes/new"
          element={
            <Lazy fallback={<FormSkeleton title="Add a recipe" />}>
              <RecipeFormPage />
            </Lazy>
          }
        />
        <Route
          path="recipes/:id"
          element={
            <Lazy fallback={<DetailSkeleton />}>
              <RecipeDetailPage />
            </Lazy>
          }
        />
        <Route
          path="recipes/:id/edit"
          element={
            <Lazy fallback={<FormSkeleton title="Edit recipe" />}>
              <RecipeFormPage />
            </Lazy>
          }
        />
        <Route
          path="favorites"
          element={
            <Lazy fallback={<FavoritesSkeleton />}>
              <FavoritesPage />
            </Lazy>
          }
        />
        <Route
          path="shopping-list"
          element={
            <Lazy fallback={<ShoppingListSkeleton />}>
              <ShoppingListPage />
            </Lazy>
          }
        />
        <Route
          path="about"
          element={
            <Lazy fallback={<AboutSkeleton />}>
              <AboutPage />
            </Lazy>
          }
        />
        <Route
          path="*"
          element={
            <Lazy fallback={null}>
              <NotFoundPage />
            </Lazy>
          }
        />
      </Route>
    </Routes>
  )
}
