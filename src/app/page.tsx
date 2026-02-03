import InstitutionalContainer from '../components/institucional/institutional-container.tsx'
import TopbarInstitucional from '../components/institucional/topbar-institutional.tsx'
import HeroInstitutional from '../components/institucional/hero-institutional.tsx'
import SectionInstitutional from '../components/institucional/section-institutional.tsx'
import { FormDiagnostico } from '../components/institucional/form-diagnostico.tsx'
import RodapeInstitucional from '../components/institucional/rodape-institutional.tsx'

export default function Page() {
  return (
    <InstitutionalContainer>
      {/* Adicione scroll-smooth na tag html ou use css global */}
      <div className="scroll-smooth">
        <TopbarInstitucional />
        
        <HeroInstitutional />
        
        <SectionInstitutional />

        {/* Garante que o ID "leads" esteja dentro do FormDiagnostico */}
        <FormDiagnostico isDark />

        <RodapeInstitucional />
      </div>
    </InstitutionalContainer>
  )
}