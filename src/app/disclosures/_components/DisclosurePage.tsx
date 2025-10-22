import React from "react";
import MarkdownRenderer from "@/components/Markdown";

type MarkdownPageProps = {
  url: string;
};

export const MarkdownPage = async ({ url }: MarkdownPageProps) => {
  console.log("url", url);
  const res = await fetch(url, { next: { revalidate: 3600 } }); // caching for 1 hour

  if (!res.ok) {
    return (
      <div className="font-secondary m-auto text-bold text-2xl">
        Failed to load the page
      </div>
    );
  }

  const markdown = await res.text();

  return (
    <main className="prose mx-auto p-4 max-w-3xl">
      <MarkdownRenderer content={markdown} />
    </main>
  );
};
