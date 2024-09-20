"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListStart } from "lucide-react";
import { addToQueue } from "@/actions/queue/add-to-queue";
import { searchPatients } from "@/actions/search/search-patient";
import { useRouter } from "next/navigation";

interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isNewPatient: boolean;
}

interface AddPatientToQueueDialogProps {
  queueId: string;
}

const AddPatientToQueueDialog = ({ queueId }: AddPatientToQueueDialogProps) => {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(
    async (query: string) => {
      setSearch(query);
      if (query.length > 2) {
        const result = await searchPatients(query);
        if (result.success) {
          if (result.patients !== undefined) {
            setPatients(result.patients);
          }
        } else {
          console.error(result.error);
          setPatients([]);
        }
      } else {
        setPatients([]);
      }
    },
    [setPatients]
  );

  const handleAddToQueue = useCallback(async () => {
    if (selectedPatient) {
      const result = await addToQueue({
        queueId,
        patientId: selectedPatient.id,
      });
      if (result.success) {
        setSearch("");
        setSelectedPatient(null);
        setPatients([]);
        setIsOpen(false);
        router.refresh();
      } else {
        alert("Failed to add patient to queue");
      }
    }
  }, [selectedPatient, queueId, router]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-button-blue">
          <ListStart className="w-6 h-6 mr-2" /> Add Patient to Queue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Patient to Queue</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search patients by name, email, or phone..."
          />
          <ul className="max-h-60 overflow-y-auto">
            {patients.map((patient) => (
              <li
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={`p-2 cursor-pointer ${
                  selectedPatient?.id === patient.id ? "bg-blue-100" : ""
                }`}
              >
                <div>
                  {patient.name} {patient.isNewPatient ? "(New)" : ""}
                </div>
                <div className="text-sm text-gray-500">
                  {patient.email || patient.phone || "No contact info"}
                </div>
              </li>
            ))}
          </ul>
          {selectedPatient && (
            <Button className="my-button-blue" onClick={handleAddToQueue}>
              Add {selectedPatient.name} to Queue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientToQueueDialog;
