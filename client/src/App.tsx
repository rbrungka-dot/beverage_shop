import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Admin from "./pages/Admin";
import TestPayment from "./pages/TestPayment";
import { useEffect } from "react";
import { useAuth } from "./_core/hooks/useAuth";

// After OAuth callback lands on "/", check sessionStorage for a returnPath and redirect there.
function OAuthReturnRedirect() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) return;
    if (location !== "/") return;
    const returnPath = sessionStorage.getItem("oauth_return_path");
    if (returnPath && returnPath !== "/") {
      sessionStorage.removeItem("oauth_return_path");
      navigate(returnPath);
    }
  }, [isAuthenticated, loading, location, navigate]);

  return null;
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OAuthReturnRedirect />
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/orders" component={Orders} />
          <Route path="/orders/:id" component={Orders} />
          <Route path="/about" component={About} />
          <Route path="/admin" component={Admin} />
          <Route path="/test-payment" component={TestPayment} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
