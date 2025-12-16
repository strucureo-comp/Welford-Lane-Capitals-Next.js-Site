const principles = [
  {
    number: '01',
    title: 'Integrity',
    description: 'Long-term capital integrity is our mandate. We prioritize consistency over speculation, ensuring every position is backed by rigorous logic.'
  },
  {
    number: '02',
    title: 'Structure',
    description: 'We do not predict; we analyze structure. By understanding liquidity behavior and volatility cycles, we identify repeatable alpha.'
  },
  {
    number: '03',
    title: 'Precision',
    description: 'Institutional execution requires institutional infrastructure. Our risk-first governance ensures disciplined participation in all markets.'
  }
];

export function CorePrinciples() {
  return (
    <section className="border-b border-grid-line bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 sm:p-8 md:p-12 border-b md:border-r border-grid-line bg-white md:col-span-2 lg:col-span-1">
          <h2 className="font-display text-xl sm:text-2xl font-bold mb-4">Core Principles</h2>
          <div className="w-12 h-1 bg-signal-blue mb-4"></div>
          <p className="text-sm text-gray-500">The foundation of our systematic approach.</p>
        </div>

        {principles.map((principle, index) => (
          <div
            key={principle.number}
            className={`p-6 sm:p-8 md:p-12 border-b md:border-b-0 ${
              index === 0 ? 'md:border-r lg:border-r' : index === 1 ? 'lg:border-r' : ''
            } border-grid-line hover:bg-off-white transition-colors group`}
          >
            <div className="text-gray-300 font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 group-hover:text-signal-blue transition-colors">
              {principle.number}
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold mb-2 sm:mb-3">{principle.title}</h3>
            <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
