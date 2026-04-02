"use client";

import { Task, TaskFilter } from "@/lib/types";
import { createStore } from "@/lib/utils/store";

interface TaskStoreState {
  tasks: Task[];
  selectedTaskId: string | null;
  activeStatus: TaskFilter["status"];
  provider: NonNullable<TaskFilter["provider"]>;
  search: string;
  sortBy: NonNullable<TaskFilter["sortBy"]>;
  detailModalOpen: boolean;
}

const store = createStore<TaskStoreState>({
  tasks: [],
  selectedTaskId: null,
  activeStatus: "all",
  provider: "all",
  search: "",
  sortBy: "updatedAt",
  detailModalOpen: false
});

export const taskStore = {
  ...store,
  setTasks: (tasks: Task[]) => store.setState({ tasks }),
  setSelectedTask: (selectedTaskId: string | null) => store.setState({ selectedTaskId }),
  setStatus: (activeStatus: TaskStoreState["activeStatus"]) => store.setState({ activeStatus }),
  setProvider: (provider: TaskStoreState["provider"]) => store.setState({ provider }),
  setSearch: (search: string) => store.setState({ search }),
  setSortBy: (sortBy: TaskStoreState["sortBy"]) => store.setState({ sortBy }),
  setDetailModalOpen: (detailModalOpen: boolean) => store.setState({ detailModalOpen })
};

export const useTaskStore = <T,>(selector: (state: TaskStoreState) => T) => taskStore.useStore(selector);
