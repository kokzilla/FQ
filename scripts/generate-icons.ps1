Add-Type -AssemblyName System.Drawing

function Create-PwaIcon {
    param (
        [int]$Size,
        [string]$OutputPath,
        [bool]$IsMaskable = $false
    )

    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bitmap)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    [float]$s = [float]$Size / 512.0

    # Colors
    $colIndigoDark = [System.Drawing.Color]::FromArgb(255, 30, 27, 75)
    $colIndigoLight= [System.Drawing.Color]::FromArgb(255, 67, 56, 202)
    $colGold       = [System.Drawing.Color]::FromArgb(255, 245, 158, 11)
    $colGoldDark   = [System.Drawing.Color]::FromArgb(255, 217, 119, 6)
    $colWhite      = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
    $colSlateLight = [System.Drawing.Color]::FromArgb(255, 203, 213, 225)
    $colGreen      = [System.Drawing.Color]::FromArgb(255, 16, 185, 129)

    # Background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.PointF(0, 0)),
        (New-Object System.Drawing.PointF($Size, $Size)),
        $colIndigoDark,
        $colIndigoLight
    )

    if ($IsMaskable) {
        $g.FillRectangle($bgBrush, $rect)
    } else {
        [float]$radius = 96.0 * $s
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        [float]$diameter = $radius * 2.0
        $path.AddArc(0.0, 0.0, $diameter, $diameter, 180.0, 90.0)
        $path.AddArc([float]($Size - $diameter), 0.0, $diameter, $diameter, 270.0, 90.0)
        $path.AddArc([float]($Size - $diameter), [float]($Size - $diameter), $diameter, $diameter, 0.0, 90.0)
        $path.AddArc(0.0, [float]($Size - $diameter), $diameter, $diameter, 90.0, 90.0)
        $path.CloseFigure()
        $g.FillPath($bgBrush, $path)

        $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 255, 255, 255), [float](4.0 * $s))
        $g.DrawPath($borderPen, $path)
        $borderPen.Dispose()
        $path.Dispose()
    }
    $bgBrush.Dispose()

    [float]$contentScale = if ($IsMaskable) { 0.82 } else { 1.0 }
    [float]$centerOffset = [float](($Size * (1.0 - $contentScale)) / 2.0)

    $saveState = $g.Save()
    $g.TranslateTransform($centerOffset, $centerOffset)
    $g.ScaleTransform($contentScale, $contentScale)

    # Card
    [float]$cardX = 116.0 * $s
    [float]$cardY = 86.0 * $s
    [float]$cardW = 280.0 * $s
    [float]$cardH = 220.0 * $s
    [float]$cardRadius = 24.0 * $s
    [float]$sD = $cardRadius * 2.0

    # Card shadow
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 0, 0, 0))
    $shadowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    [float]$sX = $cardX
    [float]$sY = $cardY + (8.0 * $s)
    $shadowPath.AddArc($sX, $sY, $sD, $sD, 180.0, 90.0)
    $shadowPath.AddArc([float]($sX + $cardW - $sD), $sY, $sD, $sD, 270.0, 90.0)
    $shadowPath.AddArc([float]($sX + $cardW - $sD), [float]($sY + $cardH - $sD), $sD, $sD, 0.0, 90.0)
    $shadowPath.AddArc($sX, [float]($sY + $cardH - $sD), $sD, $sD, 90.0, 90.0)
    $shadowPath.CloseFigure()
    $g.FillPath($shadowBrush, $shadowPath)
    $shadowBrush.Dispose()
    $shadowPath.Dispose()

    # Card background
    $cardPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $cardPath.AddArc($cardX, $cardY, $sD, $sD, 180.0, 90.0)
    $cardPath.AddArc([float]($cardX + $cardW - $sD), $cardY, $sD, $sD, 270.0, 90.0)
    $cardPath.AddArc([float]($cardX + $cardW - $sD), [float]($cardY + $cardH - $sD), $sD, $sD, 0.0, 90.0)
    $cardPath.AddArc($cardX, [float]($cardY + $cardH - $sD), $sD, $sD, 90.0, 90.0)
    $cardPath.CloseFigure()

    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 255, 255, 255))
    $g.FillPath($cardBrush, $cardPath)
    $cardBrush.Dispose()

    # Card Header
    $g.SetClip($cardPath)
    $headerBrush = New-Object System.Drawing.SolidBrush($colIndigoLight)
    $g.FillRectangle($headerBrush, (New-Object System.Drawing.RectangleF($cardX, $cardY, $cardW, [float](56.0 * $s))))
    $headerBrush.Dispose()

    # Silhouettes
    $bldBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 224, 231, 255))
    $bldBrush2 = New-Object System.Drawing.SolidBrush($colWhite)
    $g.FillRectangle($bldBrush1, (New-Object System.Drawing.RectangleF([float](150.0 * $s), [float](105.0 * $s), [float](24.0 * $s), [float](37.0 * $s))))
    $g.FillRectangle($bldBrush2, (New-Object System.Drawing.RectangleF([float](180.0 * $s), [float](95.0 * $s), [float](32.0 * $s), [float](47.0 * $s))))
    $g.FillRectangle($bldBrush1, (New-Object System.Drawing.RectangleF([float](218.0 * $s), [float](110.0 * $s), [float](22.0 * $s), [float](32.0 * $s))))
    $bldBrush1.Dispose()
    $bldBrush2.Dispose()

    $g.ResetClip()
    $cardPath.Dispose()

    # Checklist rows
    $checkBrush = New-Object System.Drawing.SolidBrush($colGreen)
    $barBrush = New-Object System.Drawing.SolidBrush($colSlateLight)
    $penCheck = New-Object System.Drawing.Pen($colWhite, [Math]::Max([float]1.5, [float](3.0 * $s)))

    # Row 1
    $g.FillEllipse($checkBrush, (New-Object System.Drawing.RectangleF([float](146.0 * $s), [float](164.0 * $s), [float](22.0 * $s), [float](22.0 * $s))))
    $g.DrawLines($penCheck, [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float](152.0 * $s), [float](175.0 * $s))),
        (New-Object System.Drawing.PointF([float](156.0 * $s), [float](179.0 * $s))),
        (New-Object System.Drawing.PointF([float](163.0 * $s), [float](170.0 * $s)))
    ))
    $g.FillRectangle($barBrush, (New-Object System.Drawing.RectangleF([float](180.0 * $s), [float](170.0 * $s), [float](150.0 * $s), [float](10.0 * $s))))

    # Row 2
    $g.FillEllipse($checkBrush, (New-Object System.Drawing.RectangleF([float](146.0 * $s), [float](200.0 * $s), [float](22.0 * $s), [float](22.0 * $s))))
    $g.DrawLines($penCheck, [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float](152.0 * $s), [float](211.0 * $s))),
        (New-Object System.Drawing.PointF([float](156.0 * $s), [float](215.0 * $s))),
        (New-Object System.Drawing.PointF([float](163.0 * $s), [float](206.0 * $s)))
    ))
    $g.FillRectangle($barBrush, (New-Object System.Drawing.RectangleF([float](180.0 * $s), [float](206.0 * $s), [float](120.0 * $s), [float](10.0 * $s))))

    # Row 3
    $goldBrush = New-Object System.Drawing.SolidBrush($colGold)
    $g.FillEllipse($goldBrush, (New-Object System.Drawing.RectangleF([float](146.0 * $s), [float](236.0 * $s), [float](22.0 * $s), [float](22.0 * $s))))
    $g.DrawLines($penCheck, [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float](152.0 * $s), [float](247.0 * $s))),
        (New-Object System.Drawing.PointF([float](156.0 * $s), [float](251.0 * $s))),
        (New-Object System.Drawing.PointF([float](163.0 * $s), [float](242.0 * $s)))
    ))
    $g.FillRectangle($barBrush, (New-Object System.Drawing.RectangleF([float](180.0 * $s), [float](242.0 * $s), [float](160.0 * $s), [float](10.0 * $s))))

    $checkBrush.Dispose()
    $barBrush.Dispose()
    $penCheck.Dispose()

    # Floating Badge
    [float]$badgeR = 30.0 * $s
    [float]$badgeX = 368.0 * $s
    [float]$badgeY = 126.0 * $s
    $g.FillEllipse($goldBrush, (New-Object System.Drawing.RectangleF([float]($badgeX - $badgeR), [float]($badgeY - $badgeR), [float]($badgeR * 2.0), [float]($badgeR * 2.0))))
    $darkGoldBrush = New-Object System.Drawing.SolidBrush($colGoldDark)
    [float]$innerR = 24.0 * $s
    $g.FillEllipse($darkGoldBrush, (New-Object System.Drawing.RectangleF([float]($badgeX - $innerR), [float]($badgeY - $innerR), [float]($innerR * 2.0), [float]($innerR * 2.0))))
    $badgePen = New-Object System.Drawing.Pen($colWhite, [Math]::Max([float]2.0, [float](4.5 * $s)))
    $g.DrawLines($badgePen, [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF([float]($badgeX - (10.0 * $s)), $badgeY)),
        (New-Object System.Drawing.PointF([float]($badgeX - (3.0 * $s)), [float]($badgeY + (8.0 * $s)))),
        (New-Object System.Drawing.PointF([float]($badgeX + (11.0 * $s)), [float]($badgeY - (7.0 * $s))))
    ))
    $goldBrush.Dispose()
    $darkGoldBrush.Dispose()
    $badgePen.Dispose()

    # Text BRU FQ
    $fontFamily = [System.Drawing.FontFamily]::GenericSansSerif
    [float]$fontSize = [Math]::Max([float]10.0, [float](56.0 * $s))
    $font = New-Object System.Drawing.Font($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold)

    $whiteBrush = New-Object System.Drawing.SolidBrush($colWhite)
    $goldTextBrush = New-Object System.Drawing.SolidBrush($colGold)

    [float]$textY = 338.0 * $s
    $g.DrawString("BRU", $font, $whiteBrush, [float](148.0 * $s), $textY)
    $g.DrawString("FQ", $font, $goldTextBrush, [float](292.0 * $s), $textY)

    # Subtitle Ribbon
    [float]$ribbonW = 230.0 * $s
    [float]$ribbonH = 24.0 * $s
    [float]$ribbonX = [float](($Size - $ribbonW) / 2.0)
    [float]$ribbonY = 412.0 * $s
    $ribbonBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(45, 255, 255, 255))
    $g.FillRectangle($ribbonBrush, (New-Object System.Drawing.RectangleF($ribbonX, $ribbonY, $ribbonW, $ribbonH)))
    $ribbonBrush.Dispose()

    $subFont = New-Object System.Drawing.Font($fontFamily, [Math]::Max([float]6.0, [float](11.0 * $s)), [System.Drawing.FontStyle]::Bold)
    $subBrush = New-Object System.Drawing.SolidBrush($colSlateLight)
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("FACILITY QUALITY", $subFont, $subBrush, (New-Object System.Drawing.RectangleF($ribbonX, $ribbonY, $ribbonW, $ribbonH)), $format)

    $font.Dispose()
    $subFont.Dispose()
    $whiteBrush.Dispose()
    $goldTextBrush.Dispose()
    $subBrush.Dispose()
    $format.Dispose()

    $g.Restore($saveState)
    $g.Dispose()

    # Save PNG
    $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose()
    Write-Host "Generated: $OutputPath ($Size x $Size)"
}

Create-PwaIcon -Size 192 -OutputPath "public/pwa-192x192.png" -IsMaskable $false
Create-PwaIcon -Size 512 -OutputPath "public/pwa-512x512.png" -IsMaskable $false
Create-PwaIcon -Size 512 -OutputPath "public/maskable-icon-512x512.png" -IsMaskable $true
Create-PwaIcon -Size 180 -OutputPath "public/apple-touch-icon-180x180.png" -IsMaskable $false
Create-PwaIcon -Size 64  -OutputPath "public/pwa-64x64.png" -IsMaskable $false
