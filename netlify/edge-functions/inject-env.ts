import type { Context } from "@netlify/edge-functions";

// FIX: Add type declaration for Deno to satisfy TypeScript compiler.
// The `Deno` global is available in the Netlify Edge Function runtime.
declare const Deno: any;

export default async (request: Request, context: Context) => {
  // Get the original page content
  const response = await context.next();
  const page = await response.text();

  // Get the API key from Netlify's environment variables
  const apiKey = Deno.env.get("API_KEY");

  // If the API key is not set, return the page as is with a warning in the console.
  if (!apiKey) {
    console.warn("API_KEY environment variable not found. Please set it in your Netlify site settings.");
    return new Response(page, response);
  }

  // Replace the placeholder with the actual API key
  const updatedPage = page.replace("__API_KEY__", apiKey);

  // Return the modified page
  return new Response(updatedPage, response);
};
