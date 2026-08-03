export type DiscoveryStatus = "draft" | "submitted" | "approved";
export type ProposalStatus = "draft" | "review" | "approved" | "shared";

export class InvalidTransitionError extends Error {
  constructor(entity: string, from: string, to: string) {
    super(`Invalid ${entity} transition: ${from} -> ${to}`);
    this.name = "InvalidTransitionError";
  }
}

const DISCOVERY_TRANSITIONS: Readonly<Record<DiscoveryStatus, readonly DiscoveryStatus[]>> = {
  draft: ["submitted"],
  submitted: ["draft", "approved"],
  approved: [],
};

const PROPOSAL_TRANSITIONS: Readonly<Record<ProposalStatus, readonly ProposalStatus[]>> = {
  draft: ["review"],
  review: ["draft", "approved"],
  approved: ["draft", "shared"],
  shared: [],
};

function transition<TStatus extends string>(
  entity: string,
  current: TStatus,
  next: TStatus,
  transitions: Readonly<Record<TStatus, readonly TStatus[]>>,
): TStatus {
  if (!transitions[current].includes(next)) {
    throw new InvalidTransitionError(entity, current, next);
  }

  return next;
}

export function transitionDiscovery(
  current: DiscoveryStatus,
  next: DiscoveryStatus,
): DiscoveryStatus {
  return transition("Discovery", current, next, DISCOVERY_TRANSITIONS);
}

export function transitionProposal(current: ProposalStatus, next: ProposalStatus): ProposalStatus {
  return transition("Proposal", current, next, PROPOSAL_TRANSITIONS);
}

export function requiresProposalReapproval(
  current: ProposalStatus,
  commercialTermsChanged: boolean,
): ProposalStatus {
  if (current === "approved" && commercialTermsChanged) {
    return "draft";
  }

  return current;
}

