import { createFileRoute } from "@tanstack/react-router";
import { WorkApp } from "@/components/work-app";

export const Route = createFileRoute("/")({ component: WorkApp });
