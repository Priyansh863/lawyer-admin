"use client"
import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password,
        redirect: false,
      });

      if (!result) {
        throw new Error("No response from server. Please try again.");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      const userInfo = await getSession();

      console.log(userInfo,"userInfouserInfouserInfouserInfo")

      if (userInfo?.user?.email) {
        localStorage.setItem("user", JSON.stringify(userInfo.user));

        if ((userInfo.user as any)?.token) {
          localStorage.setItem("token", (userInfo.user as any).token);
        }

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userInfo.user.email}!`,
          variant: "default",
        });

        router.push("/dashboard");
      } else {
        throw new Error("User data not found");
      }
    } catch (error) {
      console.log(error,"errorerrorerrorerrorerror")
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <h1 className="text-2xl font-bold font-heading">Welcome Back!</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" className="bg-gray-50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="bg-gray-50 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#0f0921] hover:bg-[#0f0921]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </Button>
          </form>
        </Form>

        {/* Remove the sign up link section below */}
        {/* <div className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="font-medium hover:underline">
            Sign Up
          </Link>
        </div> */}
      </CardContent>
      <CardFooter className="text-xs text-center text-muted-foreground flex flex-col">
        <p>This site is protected by reCAPTCHA and the</p>
        <p>
          Google{" "}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline">
            Terms
          </Link>{" "}
          of service apply.
        </p>
      </CardFooter>
    </Card>
  );
}
