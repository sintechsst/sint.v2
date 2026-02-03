import InstitutionalContainer from '../components/institucional/institutional-container'
import TopbarInstitucional from '../components/institucional/topbar-institutional'
import HeroInstitutional from '../components/institucional/hero-institutional'
import SectionInstitutional from '../components/institucional/section-institutional'
import { FormDiagnostico } from '../components/institucional/form-diagnostico'
import RodapeInstitucional from '../components/institucional/rodape-institutional'

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
