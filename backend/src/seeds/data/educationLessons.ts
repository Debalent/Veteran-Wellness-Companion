// =============================================================================
// Education Lesson Seed Data
// =============================================================================
// Evidence-based educational content for stress management and resilience.
// These lessons are loaded into the database during seeding.
// Content is grounded in VA best practices and clinical research.
// =============================================================================

import type { LessonCategory } from '@prisma/client';

interface LessonSeed {
  title: string;
  summary: string;
  content: string;
  category: LessonCategory;
  duration: number;
  orderIndex: number;
}

export const educationLessons: LessonSeed[] = [
  {
    title: 'Understanding Stress: The Body\'s Alarm System',
    summary: 'Learn how stress affects your body and mind, and why understanding your stress response is the first step to managing it.',
    content: `## What is Stress?
    
Stress is your body's natural response to perceived threats or challenges. When you encounter a stressor, your body releases hormones like adrenaline and cortisol that prepare you for "fight or flight."

## The Stress Response

While this response can be life-saving in emergencies, chronic activation of your stress response can take a toll on your health. Common signs of chronic stress include:
- Difficulty sleeping
- Irritability or mood swings
- Difficulty concentrating
- Physical tension, especially in the neck and shoulders
- Changes in appetite

## Stress and Veterans

As a veteran, you may have experienced extended periods of high alertness during service. Your body learned to stay vigilant. Transitioning to civilian life means teaching your nervous system that it's safe to relax.

## Key Takeaway

Stress is not inherently bad — it's your body's way of preparing for action. The goal isn't to eliminate stress, but to manage it effectively so it doesn't control your life.`,
    category: 'STRESS_MANAGEMENT',
    duration: 8,
    orderIndex: 1,
  },
  {
    title: 'Building Resilience: Your Inner Strength',
    summary: 'Discover practical ways to build emotional resilience and bounce back from challenges stronger than before.',
    content: `## What is Resilience?

Resilience is the ability to adapt and recover from adversity, trauma, or significant stress. It's not about avoiding difficult experiences — it's about developing the tools to navigate them effectively.

## Core Components of Resilience

1. **Self-awareness**: Recognizing your emotions and reactions
2. **Self-care**: Prioritizing sleep, nutrition, and exercise
3. **Connection**: Maintaining supportive relationships
4. **Purpose**: Having meaningful goals and values
5. **Adaptability**: Being flexible in your thinking and approach

## Building Resilience as a Veteran

Your military service has already developed many resilience skills: discipline, teamwork, adaptability, and perseverance. The key is learning to apply these skills in a civilian context and recognizing when to ask for support.

## Resilience Practices

- Practice mindfulness or meditation for 5-10 minutes daily
- Maintain a consistent sleep schedule
- Stay connected with fellow veterans and supportive friends
- Set small, achievable goals each week`,
    category: 'RESILIENCE_BUILDING',
    duration: 10,
    orderIndex: 1,
  },
  {
    title: 'Coping with Transitions: Military to Civilian Life',
    summary: 'Navigate the transition from military to civilian life with practical strategies and understanding of common challenges.',
    content: `## The Transition Challenge

Leaving military service is one of life's most significant transitions. After years of structure, clear chain of command, and shared mission, civilian life can feel disorienting.

## Common Transition Experiences

- Loss of identity and purpose
- Difficulty relating to civilian coworkers
- Missing the camaraderie of service
- Struggling with unstructured time
- Frustration with civilian pace and priorities

## Strategies for Success

1. **Find your new mission**: Identify goals that give you purpose
2. **Build your network**: Connect with veteran service organizations
3. **Create structure**: Establish daily routines that work for you
4. **Be patient**: Transition takes time — typically 12-18 months
5. **Seek support**: VA services, veteran mentors, and counseling can help

## Remember

Your military experience gave you unique strengths. The discipline, leadership, and resilience you developed are valuable in any setting.`,
    category: 'TRANSITION_SUPPORT',
    duration: 12,
    orderIndex: 1,
  },
  {
    title: 'Mindfulness for Everyday Wellness',
    summary: 'Learn simple mindfulness techniques to reduce stress, improve focus, and enhance your overall well-being.',
    content: `## What is Mindfulness?

Mindfulness is the practice of paying attention to the present moment without judgment. It's a simple but powerful tool for managing stress and improving quality of life.

## Benefits of Mindfulness

- Reduces stress and anxiety
- Improves concentration and focus
- Enhances emotional regulation
- Improves sleep quality
- Increases self-awareness

## Simple Mindfulness Exercise

**The 5-4-3-2-1 Technique:**
Take a moment to notice:
- **5** things you can see
- **4** things you can touch
- **3** things you can hear
- **2** things you can smell
- **1** thing you can taste

This exercise brings you into the present moment and can be done anywhere, anytime.

## Getting Started

Start with just 2-3 minutes per day. Use apps like Headspace or Calm for guided sessions. The key is consistency, not duration.`,
    category: 'MINDFULNESS',
    duration: 7,
    orderIndex: 1,
  },
  {
    title: 'Sleep Hygiene for Optimal Wellness',
    summary: 'Understand the importance of quality sleep and learn practical strategies for improving your sleep habits.',
    content: `## Why Sleep Matters

Quality sleep is essential for physical health, emotional regulation, and cognitive function. Poor sleep is linked to increased stress, mood problems, and decreased immune function.

## Common Sleep Challenges for Veterans

- Hypervigilance making it hard to relax
- Nightmares or sleep disturbances
- Irregular schedules affecting sleep rhythm
- Chronic pain interfering with rest

## Sleep Hygiene Tips

1. **Consistent schedule**: Go to bed and wake up at the same time daily
2. **Create a wind-down routine**: 30 minutes of calm activity before bed
3. **Optimize your environment**: Cool, dark, and quiet bedroom
4. **Limit screen time**: No phones or screens 1 hour before bed
5. **Avoid caffeine after 2 PM**
6. **Exercise regularly**, but not within 3 hours of bedtime

## When to Seek Help

If sleep problems persist for more than 3 weeks, talk to your VA provider. Sleep disorders are treatable.`,
    category: 'SLEEP_HYGIENE',
    duration: 8,
    orderIndex: 1,
  },
  {
    title: 'Effective Communication in Relationships',
    summary: 'Strengthen your relationships with practical communication skills for veterans and their loved ones.',
    content: `## Communication and Relationships

Strong relationships are a cornerstone of wellness. Effective communication helps you connect with others, express your needs, and resolve conflicts constructively.

## Common Communication Challenges

- Military communication style (direct, mission-focused)
- Difficulty expressing emotions
- Avoiding difficult conversations
- Misunderstandings with family and friends

## The DEAR MAN Technique

- **Describe**: State the situation factually
- **Express**: Share your feelings
- **Assert**: Ask for what you need
- **Reinforce**: Explain the positive outcome
- **Mindful**: Stay focused on the goal
- **Appear confident**: Use confident body language
- **Negotiate**: Be willing to find middle ground

## Practice Tips

Start with low-stakes conversations. Practice active listening by repeating back what you heard. Remember that communication is a skill that improves with practice.`,
    category: 'COMMUNICATION',
    duration: 10,
    orderIndex: 1,
  },
];