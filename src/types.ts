/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CaseStudyStep {
  title: string;
  description: string;
  icon?: string;
}

export interface DeliverableItem {
  name: string;
  type: string;
  description: string;
}

export interface WorkCaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  isFlagship?: boolean;
  role: string;
  duration: string;
  audience: string;
  overview: string;
  problem: string;
  learningObjectives: string[];
  designProcess: CaseStudyStep[];
  deliverables: DeliverableItem[];
  outcomes: {
    metrics: string[];
    summary: string;
  };
  reflection: string;
}

export interface BranchingNode {
  id: string;
  text: string;
  question: string;
  choices: {
    text: string;
    nextNodeId: string;
    feedback: string;
    scoreChange: number;
  }[];
}

export interface SandboxPlaygroundItem {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  type: 'scenario' | 'matrix' | 'cards';
}
