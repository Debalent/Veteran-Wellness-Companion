// =============================================================================
// Wellness Resource Seed Data
// =============================================================================
// Curated wellness resources covering nutrition, sleep, exercise, financial
// wellness, and other wellness dimensions.
// =============================================================================

import type { ResourceCategory } from '@prisma/client';

interface ResourceSeed {
  title: string;
  description: string;
  category: ResourceCategory;
  url: string;
}

export const wellnessResources: ResourceSeed[] = [
  {
    title: 'VA Nutrition and Food Resources',
    description: 'Access VA resources on healthy eating, nutrition counseling, and food assistance programs for veterans.',
    category: 'NUTRITION',
    url: 'https://www.nutrition.va.gov/',
  },
  {
    title: 'Whole Health: Food and Drink',
    description: 'VA Whole Health approach to nutrition — learn how food choices affect your overall well-being.',
    category: 'NUTRITION',
    url: 'https://www.va.gov/wholehealth/',
  },
  {
    title: 'VA Sleep Health Resources',
    description: 'Information on sleep disorders, sleep hygiene, and VA sleep health programs for veterans.',
    category: 'SLEEP',
    url: 'https://www.va.gov/health-care/health-needs-conditions/sleep-problems/',
  },
  {
    title: 'National Sleep Foundation',
    description: 'Evidence-based information on sleep health, sleep disorders, and improving sleep quality.',
    category: 'SLEEP',
    url: 'https://www.sleepfoundation.org/',
  },
  {
    title: 'MOVE! Weight Management Program',
    description: 'VA\'s weight management program helping veterans achieve and maintain a healthy weight through physical activity and healthy eating.',
    category: 'EXERCISE',
    url: 'https://www.move.va.gov/',
  },
  {
    title: 'Be Active Your Way',
    description: 'Physical activity guidelines and exercise resources from the VA for veterans of all ability levels.',
    category: 'EXERCISE',
    url: 'https://www.move.va.gov/',
  },
  {
    title: 'VA Financial Wellness Resources',
    description: 'Resources for managing personal finances, debt, and financial planning for veterans and families.',
    category: 'FINANCIAL_WELLNESS',
    url: 'https://www.benefits.va.gov/benefits/',
  },
  {
    title: 'Military OneSource Financial Counseling',
    description: 'Free financial counseling and resources for veterans and military families.',
    category: 'FINANCIAL_WELLNESS',
    url: 'https://www.militaryonesource.mil/',
  },
  {
    title: 'VA Vet Centers',
    description: 'Readjustment counseling services for veterans, service members, and their families at community-based Vet Centers.',
    category: 'SOCIAL_CONNECTION',
    url: 'https://www.vetcenter.va.gov/',
  },
  {
    title: 'Team Red, White & Blue',
    description: 'Connect with fellow veterans through physical and social activities in your local community.',
    category: 'SOCIAL_CONNECTION',
    url: 'https://www.teamrwb.org/',
  },
  {
    title: 'Veterans Crisis Line',
    description: 'Confidential crisis support for veterans and their loved ones. Dial 988 then Press 1. Available 24/7.',
    category: 'CRISIS_SUPPORT',
    url: 'https://www.veteranscrisisline.net/',
  },
  {
    title: 'Crisis Text Line',
    description: 'Text 838255 to connect with a crisis counselor. Free, 24/7 support for veterans in crisis.',
    category: 'CRISIS_SUPPORT',
    url: 'https://www.veteranscrisisline.net/get-help/text-crisis-line',
  },
  {
    title: 'VA Benefits Hub',
    description: 'Comprehensive guide to VA benefits including healthcare, disability, education, and housing assistance.',
    category: 'VA_BENEFITS',
    url: 'https://www.va.gov/benefits/',
  },
  {
    title: 'National Resource Directory',
    description: 'Connects wounded warriors, service members, veterans, and their families with programs and services.',
    category: 'VA_BENEFITS',
    url: 'https://www.nrd.gov/',
  },
];