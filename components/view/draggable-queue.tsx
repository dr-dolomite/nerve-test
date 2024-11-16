import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { reorderQueue } from "@/actions/queue/reorder-queue";
// import { getPatientById } from "@/data/get-patient-info";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2Icon } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  imageURL: string | null;
}

interface QueueEntry {
  id: string;
  position: number;
  status: string;
  patient: Patient;
}

interface Queue {
  id: string;
}

interface DraggableQueueProps {
  queue: Queue;
  entries: QueueEntry[];
}

const DraggableQueue = ({ queue, entries }: DraggableQueueProps) => {
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(entries);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions based on new order
    const updatedEntries = items.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    // Call the server action to update the database
    await reorderQueue({ queueId: queue.id, entries: updatedEntries });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="queue">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-4"
          >
            {entries.map((entry, index) => (
              <Draggable key={entry.id} draggableId={entry.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card className="p-4">
                      <div className="flex gap-6">
                        <Avatar>
                          <AvatarImage src={entry.patient.imageURL ?? ""} />
                          <AvatarFallback>
                            <User2Icon className="size-8" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid-gap-2">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold">
                              {entry.patient.name}
                            </h3>

                            <div className="text-sm text-gray">
                              <Badge>{entry.status}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray">
                            Queue Number {entry.position}
                          </p>
                        </div>
                      </div>
                    </Card>
                    {/* {entry.patient.name} - Status: {entry.status} */}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableQueue;
