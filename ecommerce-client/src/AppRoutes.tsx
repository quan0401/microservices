import { FC, ReactNode, Suspense } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import ConfirmEmail from '~features/auth/components/ConfirmEmail';
import ResetPasswordModal from '~features/auth/components/ResetPassword';
import { ReactElement } from 'react';
import AppPage from './features/AppPage';
import Home from './features/home/Home';
import ProtectedRoute from '~features/ProtectedRoute';
import BuyerDashboard from '~features/buyer/components/Dashboard';
import AddSeller from '~features/seller/components/add/AddSeller';
import CurrentSellerProfile from '~features/seller/components/profile/CurrentSellerProfile';
import SellerProfile from '~features/seller/components/profile/SellerProfile';
import Seller from '~features/seller/components/dashboard/Seller';
import SellerDashboard from '~features/seller/components/dashboard/SellerDashboard';
import ManageOrders from '~features/seller/components/dashboard/ManageOrders';
import ManageEarnings from '~features/seller/components/dashboard/ManageEarnings';
import Error from '~features/error/Error';
import AddGig from '~features/gigs/components/gig/AddGig';
import GigView from '~features/gigs/components/view/GigView';
import Gigs from '~features/gigs/components/gigs/Gigs';
import EditGig from '~features/gigs/components/gig/EditGig';
import Chat from '~features/chat/components/Chat';
import Checkout from '~features/order/components/Checkout';
import Requirement from '~features/order/components/Requirement';
import Order from '~features/order/components/Order';
import Settings from '~features/settings/components/Settings';
import GigsIndexDisplay from '~features/index/gig-tabs/GigsIndexDisplay';
import GigInfoDisplay from '~features/index/gig-tabs/GigInfoDisplay';
interface ILayeroutProps {
  backgroundColor: string;
  children: ReactNode;
}

const Layout: FC<ILayeroutProps> = ({ backgroundColor = '#fff', children }): ReactElement => (
  <div style={{ backgroundColor }} className="flex flex-grow">
    {children}
  </div>
);

export const AppRouter: FC = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <Suspense>
          <AppPage />
        </Suspense>
      )
    },
    {
      path: 'reset_password',
      element: (
        <Suspense>
          <ResetPasswordModal />
        </Suspense>
      )
    },
    {
      path: 'confirm_email',
      element: (
        <Suspense>
          <ConfirmEmail />
        </Suspense>
      )
    },
    {
      path: '/',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Home />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/search/categories/:category',
      element: (
        <Suspense>
          <Layout backgroundColor="#fffff">
            <GigsIndexDisplay type="categories" />
          </Layout>
        </Suspense>
      )
    },
    {
      path: '/gigs/search',
      element: (
        <Suspense>
          <Layout backgroundColor="#fffff">
            <GigsIndexDisplay type="search" />
          </Layout>
        </Suspense>
      )
    },

    {
      path: '/gig/:gigId/:title',
      element: (
        <Suspense>
          <Layout backgroundColor="#fffff">
            <GigInfoDisplay />
          </Layout>
        </Suspense>
      )
    },

    {
      path: '/users/:username/:buyerId/orders',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <BuyerDashboard />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/seller_onboarding',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <AddSeller />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/seller_profile/:username/:sellerId/edit',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <CurrentSellerProfile />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/seller_profile/:username/:sellerId/view',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <SellerProfile />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/:username/:sellerId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Seller />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      ),
      children: [
        {
          path: 'seller_dashboard',
          element: <SellerDashboard />
        },
        {
          path: 'manage_orders',
          element: <ManageOrders />
        },
        {
          path: 'manage_earnings',
          element: <ManageEarnings />
        }
      ]
    },
    {
      path: '/manage_gigs/new/:sellerId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <AddGig />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/manage_gigs/edit/:gigId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <EditGig />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/gig/:username/:title/:sellerId/:gigId/view',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <GigView />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/categories/:category',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Gigs type="categories" />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/search/gigs',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Gigs type="search" />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/inbox',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Chat />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/inbox/:email/:conversationId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Chat />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/gig/checkout/:gigId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Checkout />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },

    {
      path: '/gig/order/requirement/:gigId',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#fffff">
              <Requirement />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/orders/:orderId/activities',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#f5f5f5">
              <Order />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '/:username/edit',
      element: (
        <Suspense>
          <ProtectedRoute>
            <Layout backgroundColor="#f5f5f5">
              <Settings />
            </Layout>
          </ProtectedRoute>
        </Suspense>
      )
    },
    {
      path: '*',
      element: <Error />
    }
  ];
  return useRoutes(routes);
};
