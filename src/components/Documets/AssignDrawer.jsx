"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export default function AssignDrawer({
  open,
  onOpenChange,
  selected,
  teamLeads,
  chosenLead,
  setChosenLead,
  assignLead,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px]">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">Assign Documents</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6 p-5">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              You’re assigning <strong>{selected.length}</strong> document
              {selected.length !== 1 ? "s" : ""} to a team lead.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Select Team Lead</h3>
            <RadioGroup value={chosenLead} onValueChange={setChosenLead} className="space-y-3">
              {teamLeads.map((tl) => (
                <div
                  key={tl.id}
                  className="flex items-center gap-3 border rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <RadioGroupItem value={tl.id} id={tl.id} className="h-5 w-5 text-purple-600" />
                  <label htmlFor={tl.id} className="w-full cursor-pointer text-gray-700 font-medium">
                    {tl.name}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <SheetFooter className="mt-8">
          <Button
            disabled={!selected.length}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            onClick={assignLead}
          >
            Confirm Assignment
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
