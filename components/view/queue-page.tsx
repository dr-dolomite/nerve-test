"use client";
import { useEffect, useState } from "react";
import DraggableQueue from "@/components/view/draggable-queue";
import { checkQueue } from "@/actions/queue/check-queue";
import { PatientStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

interface QueuePageProps {
  queueId: string;
}

interface Queue {
  id: string;
  entries: {
    id: string; // Ensure the entry id is included
    position: number; // Ensure the entry position is included
    status: string; // Ensure the entry status is included
    patient: {
      id: string;
      patientStatus: PatientStatus;
      name: string;
      age: number;
      city: string | null;
      completeAddress: string | null;
      civilStatus: string | null;
      isNewPatient: boolean;
      imageURL: string | null;
    };
  }[];
}

const QueuePage = ({ queueId }: QueuePageProps) => {
  const [queue, setQueue] = useState<Queue | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!queueId || queueId === "") {
      return;
    }
    const fetchQueue = async () => {
      const result = await checkQueue(queueId);
      if (result.success) {
        if (result.queue !== undefined) {
          setQueue(result.queue);
          router.refresh();
        }
      } else {
        console.error(result.error);
      }
    };

    fetchQueue();
  }, [queueId, router]);

  if (!queue) {
    return <div>No active queue found.</div>;
  }

  return <DraggableQueue queue={queue} entries={queue.entries} />;
};

export default QueuePage;
