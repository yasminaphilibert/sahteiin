/**
 * The signature. Every chapter closes the same way — Latin and Arabic at the
 * same weight, neither translating the other. صحتين means "two healths":
 * the whole 1AM / 9AM strategy in one word.
 */
const SignOff = () => (
  <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
    <p className="display-heading text-xl md:text-2xl">TO YOUR HEALTH, TWICE.</p>
    <p className="arabic text-2xl text-bone md:text-3xl" lang="ar">
      صحتين
    </p>
  </div>
);

export default SignOff;
