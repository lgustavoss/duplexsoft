import { webPostoModuleGroups } from "@/lib/site";

export function WebPostoModulesAccordion() {
  return (
    <div className="border-t border-line bg-surface-soft/60 px-7 py-8 md:px-10">
      <h3 className="display-font text-xl font-semibold text-brand-deep">
        Áreas cobertas pelo WebPosto
      </h3>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Referência de módulos conforme o portfólio público do WebPosto. Abra cada grupo para ver
        os detalhes — a DuplexSoft orienta a combinação para o seu posto.
      </p>

      <div className="mt-6 divide-y divide-line border-t border-line">
        {webPostoModuleGroups.map((group) => (
          <details key={group.id} className="group">
            <summary className="display-font flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-lg font-semibold text-brand-deep marker:content-none [&::-webkit-details-marker]:hidden">
              <span>
                {group.title}
                <span className="ml-2 text-sm font-medium text-muted">
                  ({group.modules.length})
                </span>
              </span>
              <span
                aria-hidden="true"
                className="inline-flex h-8 w-8 items-center justify-center text-brand transition group-open:rotate-180"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </summary>
            <ul className="pb-4">
              {group.modules.map((module) => (
                <li key={module.name} className="border-t border-line/70 py-3 first:border-t-0">
                  <p className="font-semibold text-brand-deep">{module.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{module.text}</p>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </div>
  );
}
