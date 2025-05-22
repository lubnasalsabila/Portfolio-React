import React, { useEffect, useState } from 'react'
import Article from "/src/components/wrappers/Article.jsx"
import { Col, Row } from "react-bootstrap"
import { useParser } from "/src/helpers/parser.js"
import { useScheduler } from "/src/helpers/scheduler.js"
import ProjectCard from "/src/components/generic/ProjectCard.jsx"
import { useLanguage } from "/src/providers/LanguageProvider.jsx"

const AnimationStatus = {
    INVISIBLE: "invisible",
    VISIBLE: "visible",
    VISIBLE_WITH_TWEEN: "visible_with_tween"
}

function ArticlePortfolio({ data }) {
    const parser = useParser()
    const scheduler = useScheduler()
    const { selectedLanguageId } = useLanguage()

    const parsedData = parser.parseArticleData(data)

    const [parsedItems, setParsedItems] = useState([])
    const [shouldAnimate, setShouldAnimate] = useState(false)

    useEffect(() => {
        const parsedItems = parser.parseArticleItems(parsedData.items)
        const parsedCategories = parser.parseArticleCategories(parsedData.categories)
        parser.bindItemsToCategories(parsedItems, parsedCategories)

        setParsedItems(parsedItems)
        setShouldAnimate(true) // ✅ DIUBAH: tetap jalankan animasi saat inisialisasi
    }, [null, selectedLanguageId])

    useEffect(() => {
        if (shouldAnimate) {
            _setAnimationStatus(AnimationStatus.VISIBLE_WITH_TWEEN)
            setShouldAnimate(false)
        }
    }, [shouldAnimate])

    const _setAnimationStatus = (animationStatus) => {
        const tag = 'portfolio-grid'
        scheduler.clearAllWithTag(tag)
        const divs = document.querySelectorAll('.grid-item')

        switch (animationStatus) {
            case AnimationStatus.INVISIBLE:
                divs.forEach((div) => {
                    div.classList.add(`grid-item-hidden`)
                })
                break

            case AnimationStatus.VISIBLE:
                divs.forEach((div) => {
                    div.classList.remove(`grid-item-hidden`)
                })
                break

            case AnimationStatus.VISIBLE_WITH_TWEEN:
                divs.forEach((div, index) => {
                    div.classList.add(`grid-item-hidden`)
                    scheduler.schedule(() => {
                        div.classList.remove(`grid-item-hidden`)
                    }, 200 + 100 * index, tag)
                })
                break
        }
    }

    return (
        <Article className={`article-portfolio`} title={parsedData.title}>
            <Row className={`gx-4 gy-lg-4 gx-lg-5`}>
                {parsedItems.map((item, key) => (
                    <Col key={key} className={`col-12 col-sm-6 col-md-12 col-lg-6 col-xxl-4`}>
                        <ProjectCard
                            title={item.title}
                            subtitle={item.category?.singular}
                            text={item.text}
                            links={item.links}
                            options={item.mediaOptions}
                            tags={item.tags.slice(0, 3)}
                            img={item.img}
                            fallbackIcon={item.faIcon}
                            fallbackIconColors={item.faIconColors}
                            className={`grid-item-hidden`}
                        />
                    </Col>
                ))}
            </Row>
        </Article>
    )
}

export default ArticlePortfolio
