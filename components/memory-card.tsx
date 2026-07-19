'use client';

interface MemoryCardProps {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export function MemoryCard({
  title,
  date,
  description,
  imageUrl,
  imageAlt,
}: MemoryCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-video overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold text-pink-500 dark:text-pink-400 uppercase tracking-wider">
          {date}
        </p>
        <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
