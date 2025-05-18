import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
	return (
		<footer className="bg-art-primary text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Логотип и описание */}
					<div className="space-y-4">
						<Link href="/" className="block">
							<Image
								src="/aspy-logo-white.svg"
								alt="ASPY"
								width={120}
								height={40}
								className="h-10 w-auto"
							/>
						</Link>
						<p className="text-white/80 text-sm">
							Онлайн-аукцион современного искусства. Покупайте и продавайте произведения искусства в режиме реального времени.
						</p>
					</div>

					{/* Навигация */}
					<div>
						<h3 className="font-serif text-lg mb-4">Навигация</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/artworks" className="text-white/80 hover:text-white transition-colors">
									Все работы
								</Link>
							</li>
							<li>
								<Link href="/artists" className="text-white/80 hover:text-white transition-colors">
									Художники
								</Link>
							</li>
							<li>
								<Link href="/auctions" className="text-white/80 hover:text-white transition-colors">
									Аукционы
								</Link>
							</li>
							<li>
								<Link href="/about" className="text-white/80 hover:text-white transition-colors">
									О проекте
								</Link>
							</li>
						</ul>
					</div>

					{/* Информация */}
					<div>
						<h3 className="font-serif text-lg mb-4">Информация</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/how-it-works" className="text-white/80 hover:text-white transition-colors">
									Как это работает
								</Link>
							</li>
							<li>
								<Link href="/terms" className="text-white/80 hover:text-white transition-colors">
									Условия использования
								</Link>
							</li>
							<li>
								<Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
									Политика конфиденциальности
								</Link>
							</li>
						</ul>
					</div>

					{/* Контакты */}
					<div>
						<h3 className="font-serif text-lg mb-4">Контакты</h3>
						<ul className="space-y-2">
							<li className="text-white/80">
								<a href="tel:+79146707053" className="hover:text-white transition-colors">
                                +7 (914) 670-70-53
								</a>
							</li>
							<li className="text-white/80">
								<a href="mailto:info@artauction.ru" className="hover:text-white transition-colors">
									info@aspyart.com
								</a>
							</li>
							<li className="text-white/80">
								Владивосток, ул. Станюковича, д. 1
							</li>
						</ul>
					</div>
				</div>

				{/* Нижняя часть футера */}
				<div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-white/60 text-sm">
						© {new Date().getFullYear()} ASPY ART. Все права защищены.
					</p>
					<div className="flex items-center gap-4 mt-4 md:mt-0">
						<a href="#" className="text-white/60 hover:text-white transition-colors">
							<span className="sr-only">Telegram</span>
							<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
							</svg>
						</a>
						<a href="#" className="text-white/60 hover:text-white transition-colors">
							<span className="sr-only">YouTube</span>
							<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
							</svg>
						</a>
						<a href="#" className="text-white/60 hover:text-white transition-colors">
							<span className="sr-only">VK</span>
							<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.725-1.033-1.003-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.597v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202-2.17-3.048-2.763-5.335-2.763-5.812 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.747c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
} 