"use client"

import { useState } from "react"
import { useAHP } from "@/context/ahp-context"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Loader2, Lock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PasswordDialog from "@/components/ahp/password-dialog"
import { verifyExportPassword } from "@/lib/security"

export default function ExportExcelButton() {
  const [isExporting, setIsExporting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPasswordError, setIsPasswordError] = useState(false)

  const {
    criteria,
    alternatives,
    criteriaPairwise,
    alternativesPairwise,
    finalRanking,
    criteriaPairwiseComplete,
    alternativesPairwiseComplete,
  } = useAHP()

  const handleExportClick = () => {
    setIsDialogOpen(true)
    setIsPasswordError(false)
  }

  const handlePasswordSubmit = async (password: string) => {
    // Verify the password
    if (!verifyExportPassword(password)) {
      setIsPasswordError(true)
      return
    }

    // Close the dialog and proceed with export
    setIsDialogOpen(false)
    setIsPasswordError(false)

    try {
      setIsExporting(true)

      if (!criteriaPairwise) {
        toast({
          title: "Export Failed",
          description: "Criteria pairwise comparison data is not available.",
          variant: "destructive",
        })
        return
      }

      // Add a small delay to make it harder to bypass the password check
      // by modifying the code via inspect element
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Dynamically import both the library and our export function
      const [xlsxModule, { generateExcel }] = await Promise.all([import("xlsx-js-style"), import("@/lib/excel-export")])

      // Pass the XLSX module to our export function - this will generate all 4 Excel files
      await generateExcel(
        xlsxModule.default,
        criteria,
        alternatives,
        criteriaPairwise,
        alternativesPairwise,
        finalRanking,
      )

      toast({
        title: "Export Successful",
        description: "AHP analysis has been exported to 4 Excel files with different layouts and styles.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting to Excel.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setIsPasswordError(false)
  }

  const isDisabled = !criteriaPairwiseComplete || !alternativesPairwiseComplete || isExporting

  return (
    <>
      <Button onClick={handleExportClick} disabled={isDisabled} variant="outline" className="flex items-center gap-2">
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <FileSpreadsheet className="h-4 w-4" />
            <Lock className="h-3 w-3" />
          </>
        )}
        Export to Excel
      </Button>

      <PasswordDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onPasswordSubmit={handlePasswordSubmit}
        isError={isPasswordError}
      />
    </>
  )
}
