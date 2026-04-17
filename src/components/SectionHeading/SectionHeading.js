export default function SectionHeading({ title, subtitle, align = 'center' }) {
  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  return (
    <div className={`flex flex-col gap-6 mb-16 max-w-2xl ${alignmentClass} ${matchMax(align)}`}>
      <div className="w-[30px] h-[1px] bg-primary" />
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function matchMax(align) {
  if (align === 'center') return 'mx-auto';
  if (align === 'right') return 'ml-auto';
  return '';
}
