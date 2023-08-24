'use client'
import { ModuleButton } from '@/components/ModuleButton'
import { useUserStore } from '@/store/user-store'
import Image from 'next/image'

export default function LayoutApp({ children }: { children: React.ReactNode }) {
  const { modules } = useUserStore()

  return (
    <div className="flex h-screen w-screen">
      <menu className="sticky top-0 flex flex-col items-center gap-6 bg-violet-500 px-5 py-6">
        <Image
          src={'/smart-logo-icon.png'}
          alt={'SmartNew Logo'}
          width={30}
          height={30}
        />
        <nav className="flex flex-col gap-2">
          {modules?.map((module) => (
            <ModuleButton key={module.id} {...module} icon="square" />
          ))}
          {/* <ModuleButton icon="shopping-bag" name="Compras" />
          <ModuleButton icon="shopping-cart" name="Vendas" />
          <ModuleButton icon="landmark" name="Financeiro" />
          <ModuleButton icon="orbit" name="Telemetria" />
          <ModuleButton icon="list-todo" name="Task Control" />
          <ModuleButton icon="bus" name="Produção" />
          <ModuleButton icon="cog" name="Manutenção" />
          <ModuleButton icon="fuel" name="Controle de Abastecimento" />
          <ModuleButton icon="shield-check" name="Security" />
          <ModuleButton icon="file-edit" name="Contratos" /> */}
        </nav>
      </menu>

      <div className="h-full w-full overflow-auto bg-zinc-200">{children}</div>
    </div>
  )
}
