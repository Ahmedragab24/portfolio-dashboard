"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, User, Mail, Lock, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Set the document title on mount for SEO and browser tab display
  useEffect(() => {
    document.title = "إعدادات الحساب | أحمد المدني";
  }, []);

  // Initialize form fields with current logged-in user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!name.trim()) {
      toast({
        title: "خطأ في المدخلات",
        description: "الاسم لا يمكن أن يكون فارغاً",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "خطأ في المدخلات",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }

    if (password) {
      if (password.length < 6) {
        toast({
          title: "خطأ في المدخلات",
          description: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل",
          variant: "destructive",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "خطأ في المدخلات",
          description: "كلمتا المرور غير متطابقتين",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const updateData: { name: string; email: string; password?: string } = {
        name,
        email,
      };
      if (password) {
        updateData.password = password;
      }

      await updateProfile(updateData);
      
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الحساب بنجاح",
      });
      
      // Reset password fields
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "فشل التحديث",
        description: error.message || "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-8">
      {/* Page Title & Header */}
      <div className="flex items-center gap-3 border-b pb-5">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">إعدادات الحساب</h1>
          <p className="text-muted-foreground text-sm mt-1">
            إدارة بيانات حسابك الشخصي وكلمة المرور للوحة التحكم
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Card 1: Personal Info */}
          <Card className="border-primary/10 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                البيانات الشخصية
              </CardTitle>
              <CardDescription>
                تعديل اسمك وبريدك الإلكتروني لتسجيل الدخول
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="input-name" className="text-sm font-medium flex items-center justify-between">
                  <span>الاسم بالكامل</span>
                  <span className="text-xs text-muted-foreground">Full Name</span>
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="input-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 text-left border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/30"
                    placeholder="Ahmed Elmadany"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="input-email" className="text-sm font-medium flex items-center justify-between">
                  <span>البريد الإلكتروني</span>
                  <span className="text-xs text-muted-foreground">Email Address</span>
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="input-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-left border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/30"
                    placeholder="example@domain.com"
                    required
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Card 2: Security & Password */}
          <Card className="border-primary/10 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                تغيير كلمة المرور
              </CardTitle>
              <CardDescription>
                اتركه فارغاً إذا كنت لا ترغب في تغييرها
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">

              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="input-password" className="text-sm font-medium flex items-center justify-between">
                  <span>كلمة المرور الجديدة</span>
                  <span className="text-xs text-muted-foreground">New Password</span>
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 text-left border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/30"
                    placeholder="••••••••"
                  />
                  <button
                    id="btn-toggle-password"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="input-confirm-password" className="text-sm font-medium flex items-center justify-between">
                  <span>تأكيد كلمة المرور الجديدة</span>
                  <span className="text-xs text-muted-foreground">Confirm Password</span>
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="input-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 text-left border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary/30"
                    placeholder="••••••••"
                  />
                  <button
                    id="btn-toggle-confirm-password"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
          
        </div>

        {/* Form Actions Footer */}
        <div className="flex justify-end pt-4">
          <Button
            id="btn-save-settings"
            type="submit"
            size="lg"
            className="px-8 bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </div>
  );
}
