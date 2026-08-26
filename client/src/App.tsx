import StorefrontLayout from "@/components/StorefrontLayout";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import {
  About,
  Care,
  Contact,
  Privacy,
  RingSizing,
  ShippingReturns,
  Terms,
} from "@/pages/InfoPages";
import NotFound from "@/pages/NotFound";
import Product from "@/pages/Product";
import Shop from "@/pages/Shop";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <StorefrontLayout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/products/:handle" component={Product} />
        <Route path="/about" component={About} />
        <Route path="/shipping-returns" component={ShippingReturns} />
        <Route path="/ring-sizing" component={RingSizing} />
        <Route path="/care" component={Care} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </StorefrontLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <CartProvider>
            <Router />
            <Toaster richColors position="top-center" />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
