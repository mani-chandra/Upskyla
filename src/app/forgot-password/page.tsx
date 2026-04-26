"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, GraduationCap, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [debugUrl, setDebugUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setDebugUrl("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Reset link sent! Please check your email.");
        if (data.debugUrl) {
          setDebugUrl(data.debugUrl);
        }
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side: Animated Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative items-center justify-center p-12 overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 text-white max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl"
          >
            <GraduationCap className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            Don&apos;t worry, we got <span className="text-primary-200">you.</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-primary-100 leading-relaxed mb-8"
          >
            Resetting your password is quick and easy. Just enter your email and follow the instructions sent to you.
          </motion.p>
        </div>

        {/* Decorative circle */}
        <motion.div 
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500 rounded-full blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Right Side: Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 relative">
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center lg:text-left mb-10">
            <Link href="/login" className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-500">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-500 mb-6">{message}</p>
                
                {debugUrl && (
                  <div className="mb-8 p-4 bg-primary-50 border border-primary-100 rounded-2xl">
                    <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">Development Mode:</p>
                    <Link 
                      href={debugUrl}
                      className="text-sm font-medium text-primary-700 break-all hover:underline"
                    >
                      {debugUrl}
                    </Link>
                  </div>
                )}

                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Return to Login
                </Link>
              </motion.div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === "error" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg"
                  >
                    <p className="text-sm text-red-700 font-medium">{message}</p>
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 disabled:opacity-50"
                      placeholder="name@university.edu"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="relative w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-lg shadow-primary-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {status === "loading" ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Reset Link
                        <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
