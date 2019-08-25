function validEmail(email: string | null): boolean {
  if (!email) {
    return false;
  }
  return email.length > 3 && !!email.match(/.+@.+\..+/);
}

export default validEmail;
