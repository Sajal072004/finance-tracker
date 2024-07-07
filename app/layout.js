import { Inter , Outfit} from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { SignIn } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "FinanceMate",
  description: "Control Your Money",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={inter.className}>
        <Toaster/>
        {children}
        </body>
    </html> 
    </ClerkProvider>
    
  );
}
