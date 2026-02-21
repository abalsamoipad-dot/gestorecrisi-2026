import type { ReactNode } from 'react';

export interface NewsItem {
  title: string;
  date: string;
  excerpt: string;
  url: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
  imageAlt: string;
}

export interface ExpertiseCard {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  iconPath: string;
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export type SectionId = 'home' | 'expertise' | 'stats' | 'faq' | 'team' | 'news' | 'contact';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade';
