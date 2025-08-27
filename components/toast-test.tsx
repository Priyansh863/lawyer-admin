"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function ToastTest() {
  const { toast } = useToast()

  const testToast = () => {
    console.log("Toast test button clicked")
    toast({
      title: "Test Toast",
      description: "This is a test toast message to verify functionality.",
      variant: "default",
    })
    console.log("Toast function called")
  }

  const testErrorToast = () => {
    console.log("Error toast test button clicked")
    toast({
      title: "Error Toast",
      description: "This is a test error toast message.",
      variant: "destructive",
    })
    console.log("Error toast function called")
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Toast Test</h3>
      <div className="space-x-2">
        <Button onClick={testToast}>Test Success Toast</Button>
        <Button onClick={testErrorToast} variant="destructive">Test Error Toast</Button>
      </div>
    </div>
  )
}
