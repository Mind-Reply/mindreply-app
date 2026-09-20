export function checkEntitlements(userId: string) {
  // Placeholder — all users have full access for now.
  // In the future this checks Stripe subscription status.
  return {
    canAccessPro: true,
    canUseVoice: true,
    canCreateArtifacts: true,
  };
}