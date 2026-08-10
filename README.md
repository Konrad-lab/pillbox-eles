# Pillbox Health Hub

Modern, premium, responsive website for Pillbox - a Hungarian health-focused vending machine network that makes everyday healthcare products easily accessible.

Brand

Pillbox is a Hungarian health-focused vending machine network that makes everyday healthcare products easily accessible. The vending machines contain products that support everyday health, as well as seasonal items and products tailored to different age groups. The goal is to provide fast, convenient access to essential health-related products while encouraging healthier everyday habits.

Feel free to rewrite and improve this description to sound more professional and marketing-oriented.

Design Style

Modern, minimal, premium

Primary colors:

White

Green (#2E7D32, #43A047 or similar)

Light green accents

Lots of whitespace

Rounded corners

Glassmorphism where appropriate

Soft shadows

High-quality gradients

Professional typography

Mobile-first responsive layout

Feels like a modern healthcare startup

Animations

Use tasteful, smooth animations throughout the website.

Examples:

Fade-in on scroll

Slide-up sections

Parallax backgrounds

Hover animations

Animated buttons

Smooth page transitions

Floating background shapes

Cards slightly lift on hover

Animated counters

Smooth scrolling

Loading transitions

Don't overdo the animations - they should feel elegant and premium.

Pages / Sections

1. Hero / Landing Page

Large hero section containing:

Modern health-related background

Placeholder logo

Strong headline

Short introduction

CTA buttons:

Find vending machines

Learn more

Below the hero:

Short introduction

3-4 feature cards such as:

Fast

Available 24/7

Health-focused

Easy to use

Include nice icons.

2. About Us

Modern section explaining who Pillbox is.

Use placeholder text (Lorem Ipsum is acceptable), but structure it like a real company presentation.

Include:

Mission

Vision

Why choose us

Statistics cards (placeholder values)

3. Interactive Map

This is one of the main features.

Create a large interactive map of Hungary.

Show multiple vending machine locations using custom green markers.

When clicking a marker:

Open a beautiful side panel or modal containing:

Photo of the vending machine (placeholder image)

Address

Opening availability

Categories of products

Short description

Also include a "View Machine" button.

4. Interactive Machine Experience

When the user clicks View Machine, open an immersive experience.

Display a large image of the vending machine.

Create clickable hotspots over different shelves.

When hovering or clicking a shelf:

Smooth slow zoom animation toward that shelf

Small floating information card appears

Product image

Product category

Short description

Examples:

Top shelf:
Pain relief & first aid

Middle shelf:
Vitamins & supplements

Bottom shelf:
Seasonal products

The zoom animation should feel cinematic and premium.

5. Product Categories

Display modern cards for categories such as:

Everyday Health

Vitamins

First Aid

Women's Health

Men's Health

Children's Products

Seasonal Products

Hygiene

Each card:

Nice icon

Small description

Hover animation

6. Contact

Modern contact section including:

Contact form

Email

Phone

Company information

Social media placeholders

Embedded Google Maps placeholder

Footer

Include:

Logo placeholder

Navigation

Contact information

Social icons

Copyright

Technical

Build this as a polished modern React application.

Suggested stack:

React

TypeScript

Tailwind CSS

Framer Motion

shadcn/ui

Lucide Icons

Use reusable components and clean project structure.

Overall Goal

The website should immediately communicate trust, health, convenience, and innovation. It should feel comparable to modern healthcare startups or premium technology companies rather than a traditional pharmacy website.

Prioritize excellent UI/UX, smooth interactions, premium animations, and a clean responsive design. Since this is only a prototype, placeholder content is completely acceptable - the visual quality and user experience are the main priorities.

# Data Management Design the application so that vending machine data is loaded dynamically instead of being hardcoded. For this prototype, assume all vending machine information comes from a single Excel spreadsheet (this may later become Google Sheets or a database). Each vending machine should include information such as: - Machine ID - Name - Address - Latitude - Longitude - Photo - Description - Available product categories - Individual products - Stock status (optional) - Last updated date (optional) When the Excel file is updated, the website should automatically reflect those changes without requiring manual edits to the code. Build the architecture so that replacing the Excel file updates machine locations, product lists, images, and descriptions across the website. For now, use mock data that represents the future Excel structure. The code should be clean, modular, and ready for future backend integration (Google Sheets API, Excel parser, REST API, or database).

## Development

Prefer working locally? You need Node.js and npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
